import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateCourseMutation } from "../../services/mutations";
interface courseFormData {
  name: string;
  description: string;
  avatar: FileList;
}
function CreateCourse() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<courseFormData>({ mode: "onChange" });
  const { mutate: createCourse, isPending } = useCreateCourseMutation();
  const handleUpload: SubmitHandler<courseFormData> = (data) => {
    // Log file data
    console.log("Uploaded data:", data);
    if (data.avatar.length > 0) {
      console.log("Uploaded avatar:", data.avatar[0]);

      createCourse(
        {
          name: data.name,
          description: data.description,
          avatar: data.avatar[0],
        },
        {
          onSuccess: (data) => {
            console.log("Create course successful");
            console.log(data);
          },
          onError: (error) => {
            console.log("Create course failed");
            console.log(error);
          },
        }
      );
    }
  };
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] text-white flex justify-center items-center py-4 px-4 lg:px-24">
      <form
        onSubmit={handleSubmit(handleUpload)}
        className="w-full max-w-[90rem] bg-[#1C1C1E] rounded-lg p-8 shadow-zinc-900 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-white text-center sm:text-4xl">
          Create Course
        </h1>

        <div className="name-container">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-1 "
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters long",
              },
            })}
            placeholder="Enter course name"
            className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="description-container">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-1 "
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

        <div className="avatar-container">
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-gray-300 mb-1 "
          >
            Avatar
          </label>
          <input
            type="file"
            id="avatar"
            {...register("avatar", {
              required: "Avatar is required",
              validate: {
                fileSize: (files) =>
                  files?.[0]?.size <= 5 * 1024 * 1024 ||
                  "Avatar size should be less than 5MB",
                fileType: (files) =>
                  ["image/jpeg", "image/png", "image/gif"].includes(
                    files?.[0]?.type
                  ) || "Only JPEG, PNG, and GIF images are allowed",
              },
            })}
            placeholder="Please add an Avatar"
            className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.avatar && (
            <p className="text-red-500">{errors.avatar.message as string}</p>
          )}
        </div>

        <div className="submit-container mt-4 flex justify-center">
          <button
            disabled={isPending}
            type="submit"
            className="bg-blue-600 text-white text-lg font-semibold rounded-lg py-3 px-6 hover:bg-blue-700 focus:outline-none"
          >
            {isPending ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCourse;
