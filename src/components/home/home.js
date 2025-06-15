import Slider from "../slider/slider";
import Header from "../header/header";
import { useEffect, useState } from "react";
import customFetch from "../../api";
import { useToast } from "../../context/toastContext";
import Loader from '../loader/loader';
import "./home.css";

function Home() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const Toaster = useToast();

    const fetchPosts = async (page = 1, limit = 6) => {
        setLoading(true);
        try {
            const { status, body } = await customFetch(`posts?page=${page}&limit=${limit}`, {
                method: "GET",
            });

            if (status === 200) {
                setPosts(body.posts);
                setTotalPages(body.totalPages);
            } else {
                Toaster("Failed to fetch posts", "error");
            }
        } catch (error) {
            console.error("Fetch posts error:", error);
            Toaster("Error loading posts", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(page);
    }, [page]);

    return (
        <>
            <Header fetchPosts={() => fetchPosts(page)} />

            <div className="container my-5">
                <h2 className="text-center mb-4 text-light">Latest Posts</h2>

                {loading ? (
                    <div className="text-center my-5">
                        <Loader />
                    </div>
                ) : posts.length === 0 ? (
                    <p className="text-center text-muted">No posts available.</p>
                ) : (
                    <div className="row">
                        {posts.map((post) => (
                            <div key={post._id} className="col-md-4 mb-4">
                                <div className="card custom-post-card h-100">
                                    <img
                                        src={post.media}
                                        className="card-img-top"
                                        alt={post.title}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{post.title}</h5>
                                        <p className="card-text text-muted">
                                            By {post.userId?.username || "Anonymous"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <nav className="d-flex justify-content-center mt-4">
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
            <Slider />

        </>
    );
}

export default Home;
