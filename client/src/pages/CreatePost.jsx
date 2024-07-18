import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="text" placeholder="Title" required id="title" className="flex-1"/>
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-300 border-dotted p-3">
          <FileInput type="file" accept="image/*" id="image"/>
          <Button type="button" gradientDuoTone="purpleToBlue" size="sm">Upload Image</Button>
        </div>
        <ReactQuill theme="snow" placeholder="Write your post here..." className="h-72 mb-12" required />
        <Button type="submit" >Publish</Button>
      </form>
    </div>
  )
}
