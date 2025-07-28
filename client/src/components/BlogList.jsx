import React, { useEffect, useState } from "react";
import { blogCategories } from "../assets/assets";
import { motion } from "motion/react";
import BlogCard from "./BlogCard";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import ReactPaginate from "react-paginate";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const { blogs = [], setBlogs, input = "" } = useAppContext();

  const [currentPage, setCurrentPage] = useState(0);
  const blogsPerPage = 8;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blog/all");
        setBlogs(res.data.blogs);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };

    fetchBlogs();
  }, [setBlogs]);

  const filteredBlogs = blogs.filter(
    (blog) =>
      (input === "" ||
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())) &&
      (menu === "All" || blog.category === menu)
  );

  const pageCount = Math.ceil(filteredBlogs.length / blogsPerPage);
  const start = currentPage * blogsPerPage;
  const currentBlogs = filteredBlogs.slice(start, start + blogsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <div>
      {/* Categories */}
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => {
                setMenu(item);
                setCurrentPage(0); // Reset to first page on category change
              }}
              className={`cursor-pointer text-gray-500 ${
                menu === item && "text-white px-4 pt-0.5"
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full"
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-10 mx-8 sm:mx-16 xl:mx-40">
        {currentBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>

      {/* Pagination Controls */}
      {pageCount > 1 && (
        <div className="flex justify-center mb-24">
          <ReactPaginate
            breakLabel="..."
            nextLabel="→"
            previousLabel="←"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            containerClassName="flex gap-2 text-white"
            pageClassName="px-3 py-1 border rounded-md bg-gray-700 hover:bg-primary cursor-pointer"
            activeClassName="bg-primary text-white"
            previousClassName="px-3 py-1 border rounded-md bg-gray-700 cursor-pointer"
            nextClassName="px-3 py-1 border rounded-md bg-gray-700 cursor-pointer"
            disabledClassName="opacity-50 cursor-not-allowed"
            forcePage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default BlogList;
