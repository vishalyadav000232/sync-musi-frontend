import React from 'react'

export const Blob = () => {
  return (
    <>
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none z-0
                  bg-[radial-gradient(circle,_rgba(139,92,246,0.15)_0%,_transparent_70%)]
                  animate-[blobMove1_12s_ease-in-out_infinite]"></div>

      <div className="fixed bottom-[-80px] right-[-80px] w-[450px] h-[450px] rounded-full pointer-events-none z-0
                  bg-[radial-gradient(circle,_rgba(236,72,153,0.12)_0%,_transparent_70%)]
                  animate-[blobMove2_15s_ease-in-out_infinite]"></div>

      <div className="fixed top-[40%] left-[40%] w-[300px] h-[300px] rounded-full pointer-events-none z-0
                  bg-[radial-gradient(circle,_rgba(59,130,246,0.08)_0%,_transparent_70%)]
                  animate-[blobMove3_18s_ease-in-out_infinite]"></div>  
</>
  )
}
