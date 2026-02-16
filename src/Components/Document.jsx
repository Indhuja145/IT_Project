import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Document.css";

function Document() {
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Policy",
    uploadedBy: ""
  });
  const [file, setFile] = useState(null);

  // Fetch all documents
  const fetchDocuments = () => {
    axios
      .get("http://localhost:5000/api/documents")
      .then((res) => setDocuments(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle text change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload document
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("uploadedBy", formData.uploadedBy);
    data.append("file", file);

    axios
      .post("http://localhost:5000/api/add-document", data)
      .then(() => {
        fetchDocuments();
        setFormData({
          title: "",
          description: "",
          category: "Policy",
          uploadedBy: ""
        });
        setFile(null);
      })
      .catch((err) => console.log(err));
  };

  // Delete document
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/delete-document/${id}`)
      .then(() => fetchDocuments())
      .catch((err) => console.log(err));
  };

  return (
    <div className="document-container">

      <h1 className="document-title">Document Management</h1>

      {/* Document Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Download</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.title}</td>
                <td>{doc.category}</td>
                <td>{doc.uploadedBy}</td>
                <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                <td>
                  <a
                    href={`http://localhost:5000/uploads/${doc.fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-btn"
                  >
                    Download
                  </a>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(doc._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Form */}
      <div className="form-section">
        <h2>Upload Document</h2>

        <form onSubmit={handleSubmit} className="document-form">

          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Policy">Policy</option>
            <option value="Report">Report</option>
            <option value="Invoice">Invoice</option>
            <option value="Meeting">Meeting</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="uploadedBy"
            placeholder="Uploaded By"
            value={formData.uploadedBy}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            onChange={handleFileChange}
            required
          />

          <div className="button-center">
            <button type="submit" className="submit-btn">
              Upload
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

export default Document;
