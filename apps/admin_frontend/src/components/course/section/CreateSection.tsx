import { useForm, SubmitHandler } from "react-hook-form";
import { createSectionType } from "../../../types";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useCreateCourseSectionMutation } from "../../../services/mutations";
import { toast } from "react-toastify";
function CreateSection() {
  const { mutate: createNewSection, isPending } =
    useCreateCourseSectionMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createSectionType>({ mode: "onChange" });
  const { courseId } = useParams();
  const navigate = useNavigate();
  const createSection: SubmitHandler<createSectionType> = (data) => {
    console.log(data);
    data = { ...data, courseId: courseId as string };
    toast.promise(
      new Promise<string>((resolve, reject) => {
        createNewSection(data, {
          onSuccess: (data) => {
            console.log("Section created successfully");
            console.log(data);
            navigate(`/course/${courseId}`);
            resolve(data);
          },
          onError: (error) => {
            console.log(error);
            reject(error);
          },
        });
      }),
      {
        pending: "Creating section...",
        success: {
          render({ data }: { data: string }) {
            console.log(data);
            return (data as string) || "Section created successfully!";
          },
        },
        error: {
          render({ data }: { data: string }) {
            console.log(data);
            return (data as string) || "Section creation failed!";
          },
        },
      }
    );
  };
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] text-white flex justify-center items-center py-4 px-4 lg:px-24">
      <form
        onSubmit={handleSubmit(createSection)}
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

        <div className="course-id-container">
          <label
            htmlFor="courseId"
            className="block text-sm font-semibold text-gray-300 mb-1 "
          >
            Course Id
          </label>
          <input
            type="text"
            id="courseId"
            value={courseId}
            disabled
            placeholder="Enter course id"
            className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
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

export default CreateSection;
