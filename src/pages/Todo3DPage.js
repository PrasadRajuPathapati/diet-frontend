import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { Link } from 'react-router-dom';

function TodoBoard() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[2.5, 1.5, 0.1]} />
      <meshStandardMaterial color="lightgreen" />
      <Html center>
        <div className="text-black text-center w-40">
          <h2 className="font-bold text-xl mb-2">📝 ToDo</h2>
          <ul className="text-sm">
            <li>✅ Finish Workout</li>
            <li>✅ Log Weight</li>
            <li>🔲 Drink 2L Water</li>
          </ul>
        </div>
      </Html>
    </mesh>
  );
}

export default function Todo3DPage() {
  return (
    <div className="w-full h-screen bg-black text-white relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />
        <Stars />
        <OrbitControls />
        <TodoBoard />
      </Canvas>

      <Link to="/home" className="absolute top-4 left-4 px-4 py-2 bg-white text-black rounded hover:bg-green-100">
        ⬅ Back
      </Link>
    </div>
  );
}
