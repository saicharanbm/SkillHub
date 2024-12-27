function ShimmerSideBar() {
  return (
    <div className="h-screen bg-[#0A0B11] fixed w-16 p-2 animate-pulse flex flex-col gap-4 border-r-[1px] border-[#141920]">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-12 bg-[#3F3F3F] rounded-md"></div>
      ))}
    </div>
  );
}

export default ShimmerSideBar;
