import React from "react";
import { Badge } from "react-bootstrap";

function ViewArticle({ title, text, author }) {
  return (
    <>
      <div className="w-50 m-auto shadow mb-4 p-5 rounded">
        <h3>{title}</h3>
        <Badge bg="primary" className="mb-2">
          {author}
        </Badge>
        <p>{text}</p>
      </div>
    </>
  );
}

export default ViewArticle;