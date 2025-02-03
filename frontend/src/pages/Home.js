import React from 'react';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to OpenAlgo MultiUser
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-[700px]">
        A platform for managing and executing trading algorithms with real-time monitoring and multi-user support.
      </p>
    </div>
  );
}

export default Home;
