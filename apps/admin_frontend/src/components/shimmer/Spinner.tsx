function Spinner({
  text = "Verifying your credentials...",
}: {
  text?: string;
}) {
  return (
    <div className="h-[calc(100vh-8rem)] w-full  flex flex-col justify-center items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#F89A29] border-t-transparent border-solid rounded-full animate-spin"></div>
      <h1 className="text-xl text-[#f1b163]">{text}</h1>
    </div>
  );
}

export default Spinner;
