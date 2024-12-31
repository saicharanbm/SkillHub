function AccountSettings() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#F89A28] mb-4">
          Account Settings
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          We're working hard to bring you something amazing!
        </p>
        <div className="flex justify-center items-center mb-6 pt-4">
          <div className="w-24 h-2 bg-orange-500 relative">
            <div className="absolute -top-8 left-0 w-8 h-8 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="absolute -top-8 right-0 w-8 h-8 bg-orange-400 rounded-full animate-bounce"></div>
          </div>
        </div>
        <p className="text-sm text-gray-500">Stay tuned for updates!</p>
      </div>
    </div>
  );
}

export default AccountSettings;
