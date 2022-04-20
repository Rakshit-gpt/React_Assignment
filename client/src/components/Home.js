import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button, Navbar, Container } from "react-bootstrap";
import ViewArticle from "./ViewArticle";

function Home() {
  const [articles, setArticles] = useState(null);
  const [removeToken, setRemoveToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (removeToken == null) {
      navigate("/login");
    } else {
      axios
        .get("/users/viewarticles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setArticles(res.data));
    }
  }, [removeToken, navigate]);

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    setRemoveToken(null);
  }

  return (
    <>
      {localStorage.getItem("token") !== null && articles !== null ? (
        <>
          <Navbar bg="dark" variant="dark" className="mb-5">
            <Container>
              <div>
                <Navbar.Brand href="/">Q-Blogs</Navbar.Brand>
              </div>
              <div>
                <Navbar.Text className="text-white">
                  Welcome {localStorage.getItem("userName")}
                </Navbar.Text>
                <Button
                  onClick={handleLogout}
                  className="ms-5 bg-white text-black border-white"
                >
                  Logout
                </Button>
              </div>
            </Container>
          </Navbar>
          {articles.map((article, index) => (
            <ViewArticle
              key={index}
              title={article.title}
              text={article.text}
              author={article.author}
            />
          ))}
        </>
      ) : (
        <Link to="/login">
          <div style={{ textAlign: "center", cursor: "pointer" }}>
            <h1>Please Sign in</h1>
          </div>
        </Link>
      )}
    </>
  );
}

export default Home;