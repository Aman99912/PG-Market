import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Debugging logs
    console.log("Form Inputs:", inputs);
    console.log("Uploaded Images:", images);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: inputs.price ? parseInt(inputs.price) : 0,
          address: inputs.address,
          city: inputs.city,
          bedroom: inputs.bedroom ? parseInt(inputs.bedroom) : 1,
          bathroom: inputs.bathroom ? parseInt(inputs.bathroom) : 1,
          type: inputs.type,
          property: inputs.property,
          images: images.length ? images : [],
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income || "",
          size: inputs.size ? parseInt(inputs.size) : 0,
          school: inputs.school ? parseInt(inputs.school) : 0,
          bus: inputs.bus ? parseInt(inputs.bus) : 0,
          restaurant: inputs.restaurant ? parseInt(inputs.restaurant) : 0,
        },
      });

      navigate(`/${res.data.id}`);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" min="0" required />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input id="bedroom" name="bedroom" type="number" min="1" required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input id="bathroom" name="bathroom" type="number" min="1" required />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" required>
                <option value="rent" defaultChecked>Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property" required>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" required>
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" required>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input id="income" name="income" type="text" placeholder="Income Policy" />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input id="size" name="size" type="number" min="0" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input id="school" name="school" type="number" min="0" />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus</label>
              <input id="bus" name="bus" type="number" min="0" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input id="restaurant" name="restaurant" type="number" min="0" />
            </div>
            <button className="sendButton">Add</button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.length > 0 && images.map((image, index) => (
          <img src={image} key={index} alt="Uploaded" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dwa1cvbu3",
            uploadPreset: "pgMarket",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
