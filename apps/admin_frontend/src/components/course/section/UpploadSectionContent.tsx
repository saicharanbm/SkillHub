import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useUploadContentMutation } from "../../../services/mutations";
import { toast } from "react-toastify";

interface contentUploadType {
  title: string;
  description: string;
  sectionId: string;
  content: FileList;
  thumbnail: FileList;
}
function UploadSectionContent() {
  const { mutate: uploadNewContent, isPending } = useUploadContentMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<contentUploadType>({ mode: "onChange" });
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const UploadContent: SubmitHandler<contentUploadType> = (data) => {
    console.log(data);
    data = { ...data, sectionId: sectionId as string };
    const requestData = {
      title: data.title,
      description: data.description,
      courseId: courseId as string,
      sectionId: sectionId as string,
      content: data.content[0],
      thumbnail: data.thumbnail[0],
    };
    toast.promise(
      new Promise((resolve, reject) => {
        uploadNewContent(requestData, {
          onSuccess: (data) => {
            console.log("Section created successfully");
            console.log(data);
            navigate(`/course/${courseId}`);
            resolve("Content Uploaded Successfully");
          },
          onError: (error) => {
            console.log(error);
            reject(error);
          },
        });
      }),
      {
        pending: "Uploading Content...",
        success: "Content Uploaded Successfully",
        error: {
          render({ data }: { data: string }) {
            console.log(data);
            return (data as string) || "Content Upload failed!";
          },
        },
      }
    );
  };
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] text-white flex justify-center items-center py-4 px-4 lg:px-24">
      <form
        onSubmit={handleSubmit(UploadContent)}
        className="w-full max-w-[60rem] bg-[#1C1C1E] rounded-lg p-8 shadow-zinc-900 flex flex-col gap-4"
      >
        <IoMdArrowRoundBack
          size={30}
          className="cursor-pointer"
          onClick={() => navigate(`/course/${courseId}`)}
        />
        <h1 className="text-2xl font-bold text-white text-center sm:text-4xl">
          Create Section
        </h1>

        <div className="title-container">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-300 mb-1 "
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", {
              required: "title is required",
              minLength: {
                value: 3,
                message: "title must be at least 3 characters long",
              },
            })}
            placeholder="Enter course title"
            className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="description-container">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-300 mb-1 "
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters long",
              },
            })}
            rows={6}
            placeholder="Enter course description"
            className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="section-id-container">
          <label
            htmlFor="sectionId"
            className="block text-sm font-semibold text-gray-300 mb-1 "
          >
            Section Id
          </label>
          <input
            type="text"
            id="sectionId"
            value={sectionId}
            disabled
            placeholder="Enter section id"
            className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="content-container">
          <label
            htmlFor="content"
            className="block text-sm font-semibold text-gray-300 mb-1 "
          >
            Video
          </label>
          <input
            type="file"
            id="content"
            {...register("content", {
              required: "content is required",
              validate: {
                fileSize: (files) =>
                  files?.[0]?.size <= 100 * 1024 * 1024 ||
                  "content size should be less than 100MB",
                fileType: (files) =>
                  [
                    "video/mp4",
                    "video/mpeg",
                    "video/webm",
                    "video/ogg",
                    "video/avi",
                  ].includes(files?.[0]?.type) ||
                  "Only MP4, MPEG, AVI, WebM, and OGG videos are allowed",
              },
            })}
            placeholder="Please add an content"
            className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.content && (
            <p className="text-red-500">{errors.content.message as string}</p>
          )}
        </div>
        <div className="thumbnail-container">
          <label
            htmlFor="thumbnail"
            className="block text-sm font-semibold text-gray-300 mb-1 "
          >
            Thumbnail
          </label>
          <input
            type="file"
            id="thumbnail"
            {...register("thumbnail", {
              required: "thumbnail is required",
              validate: {
                fileSize: (files) =>
                  files?.[0]?.size <= 5 * 1024 * 1024 ||
                  "thumbnail size should be less than 5MB",
                fileType: (files) =>
                  files?.[0]?.type.includes("image") ||
                  "Only  images are allowed",
              },
            })}
            placeholder="Please add an thumbnail"
            className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.thumbnail && (
            <p className="text-red-500">{errors.thumbnail.message as string}</p>
          )}
        </div>

        <div className="submit-container mt-4 flex justify-center">
          <button
            disabled={isPending}
            type="submit"
            className="bg-[#F89A28] text-black text-lg font-semibold rounded-lg py-3 px-6 hover:opacity-70 focus:outline-none"
          >
            {isPending ? "Creating..." : "Create Section"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadSectionContent;
