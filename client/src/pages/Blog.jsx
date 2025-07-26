import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Moment from "moment";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import axios from "axios";

const Blog = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchBlogData();
    fetchComments();

    // ✅ Fetch logged-in user
    const token = localStorage.getItem("token") || localStorage.getItem("userToken");
    if (token) {
      axios
        .get("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setName(res.data.name);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          toast.error("Login required to comment");
        });
    }
  }, []);

  const fetchBlogData = async () => {
    try {
      const res = await axios.get(`/api/blog/get-blog/${id}`);
      setBlogData(res.data.blog);
    } catch (err) {
      console.error("Error fetching blog data:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/blog/get-comments/${id}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!user) {
      return toast.error("You must be logged in to comment");
    }

    try {
      const { data } = await axios.post("/api/blog/add-comment", {
        blog: id,
        user: user._id,
        name: user.name,
        content,
      });

      if (data.success) {
        toast.success(data.message);
        setContent(""); // keep name, clear comment only
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full bg-white">
      <Navbar />
      {blogData ? (
        <>
          <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">{blogData.title}</h1>
            <div className="flex items-center mb-6">
              <img
                src={assets.profile}
                alt="Author"
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <p className="text-gray-700">{blogData.author}</p>
                <p className="text-gray-500 text-sm">
                  {Moment(blogData.createdAt).format("MMMM Do YYYY")}
                </p>
              </div>
            </div>
            <img
              src={blogData.image}
              alt="Blog Cover"
              className="w-full h-[400px] object-cover mb-6 rounded"
            />
            <p className="text-lg text-gray-800 leading-relaxed">{blogData.description}</p>

            {/* 💬 Comment Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>
              <form onSubmit={addComment} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded outline-none"
                />
                <textarea
                  placeholder="Comment"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded outline-none resize-none h-24"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Post Comment
                </button>
              </form>
            </div>

            {/* 📃 List of Comments */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="mb-4 border-b pb-2">
                    <p className="font-semibold">{comment.name}</p>
                    <p className="text-gray-700">{comment.content}</p>
                    <p className="text-gray-400 text-sm">
                      {Moment(comment.createdAt).fromNow()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No comments yet.</p>
              )}
            </div>
          </div>
          <Footer />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Blog;
