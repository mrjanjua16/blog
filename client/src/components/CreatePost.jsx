import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const userEmail = useSelector((state) => state.user.email);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please upload an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          console.error(error);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, IMAGE: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && !formData.IMAGE) {
      setImageUploadError(
        "Please upload the selected image before publishing."
      );
      return;
    }
    try {
      const postData = { ...formData, AUTHOR: userEmail };
      const res = await fetch("/api/post/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.SLUG}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/post/get-category");
    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await res.json();
    return data.map((category) => category.NAME);
  };

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return (
    <div className="max-w-5xl mx-auto p-1 w-full">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, TITLE: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, CATEGORY: e.target.value })
            }
            disabled={isLoading || isError}
          >
            {isLoading ? (
              <option>Loading categories...</option>
            ) : isError ? (
              <option>Error loading categories</option>
            ) : (
              categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            )}
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-300 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            id="image"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {file && !formData.IMAGE && (
          <Alert color="warning">
            {`Please click on "Upload Image" before publishing.`}
          </Alert>
        )}
        {formData.IMAGE && (
          <img
            src={formData.IMAGE}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}

        <ReactQuill
          theme="snow"
          placeholder="Write your post here..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, CONTENT: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
