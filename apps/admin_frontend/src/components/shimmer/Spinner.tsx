function Spinner() {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#F89A29] border-t-transparent border-solid rounded-full animate-spin"></div>
      <h1 className="text-xl text-[#F89A28]">Verifying your credentials...</h1>
    </div>
  );
}

export default Spinner;
