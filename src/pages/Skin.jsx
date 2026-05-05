import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, Center, ContactShadows, Html, Line, Edges } from '@react-three/drei';


{/**************************************************************
This function is called to create a 3D cube that is meant
to display the layers of the skin
**************************************************************/}
function Box({ position, size = [1, 1, 1], color = "orange", labelOffset = [1.9, 1.9, 0], title, thickness, cellType, description, ...props }) {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group position={position}>
      {/* 1. THE MESH */}
      <mesh
        ref={meshRef}
        scale={active ? 1.4 : 1}
        onClick={(e) => {
          e.stopPropagation();
          setActive(!active);
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial color={active || hovered ? 'hotpink' : color} />
        <Edges scale={1} threshold={15} color="black" />
      </mesh>

      {/* 2. THE BLUEPRINT LABEL & LINE */}
      {active && (
        <group>
          <Line
            points={[[0, 0, 0], labelOffset]} 
            color="white"
            lineWidth={1}
            transparent
            opacity={0.5}
          />
          
          <Html 
            distanceFactor={10} 
            position={labelOffset} 
            center 
            zIndexRange={[100, 0]} 
          >
            <div style={{
              width: '220px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid black',
              borderRadius: '8px',
              fontFamily: 'sans-serif',
              pointerEvents: 'none',
              boxShadow: '4px 4px 0px black',
              whiteSpace: 'normal',
              color: '#000'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', borderBottom: '1px solid #ccc' }}>{title}</h4>
              <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Thickness:</strong> {thickness}</p>
              <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Cell Type:</strong> {cellType}</p>
              <p style={{ margin: '4px 0', fontSize: '11px', lineHeight: '1.4' }}><strong>Description:</strong> {description}</p>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}


{/**************************************************************
This function is called to create a 3D skin model 
**************************************************************/}
function SkinModel(props) {
  const { scene } = useGLTF('/anatomy_of_the_skin.glb');
  return <primitive object={scene} {...props} />;
}

{/**************************************************************
This function is the main one that will return everything for
this Component.
**************************************************************/}
function Skin() {
  return (
    <>
    <main className="section" style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
      <h2>Skin</h2>
      <p>Skin is the largest organ and it is healthy and needs extra care.</p>

      {/* --- Main Layout Container --- */}
      <div style={{ 
        display: 'flex', 
        gap: '30px', 
        alignItems: 'center', 
        width: '100%', 
        marginTop: '30px' ,
        background: '#F8C8C4' 
      }}>
        
        {/* Text Section (25%) */}
        <div style={{ flex: '0 0 25%', padding: '20px'}}>
          <h3>Human Skin</h3>
          <p>
            Human skin is the largest organ of the human body. It keeps our 
            watery insides from leaking out and prevents some of the smallest molecules 
            from entering the bloodstream. The skin is made up of three main 
            layers each of wich is made up of more layers. The cells that make up 
            these layers work together allowing the skin to perform all its functions.
            <em> This is an   </em>
          </p>
        </div>

        {/**************************************************************
        3D Model Section for displaying skin model occupies (75%) of screen
        **************************************************************/}
        <div style={{ 
          flex: '1', 
          height: '500px', 
          background: '#C8C8C4', 
          borderRadius: '12px',
          position: 'relative'
        }}>
          <Canvas camera={{ position: [-1, 0, 80], fov: 65 }}>
            <ambientLight intensity={1.5} />
            <Environment preset="city" />

            <Suspense fallback={null}>
              <Center position={[0, 9, 10]} rotation={[0, 4.7, 0]}>
                <SkinModel scale={1.8} />
              </Center>
              <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} />
            </Suspense>

            <OrbitControls makeDefault />
          </Canvas>
        </div>
      </div>
    </main>

	
    {/**************************************************************
    3D cubes for displaying skin layers of the epidermis
    **************************************************************/}
    <div style={{ 
        width: '100%', 
        height: '50vh', 
        background: '#CCDBE1', 
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
    }}>


					{/* --- CENTERED SCIENTIFIC TITLE --- */}
    <h1 style={{ 
      position: 'absolute',
      top: '20px',            // Lowers the title into the box
      left: '50%',            // Starts at horizontal center
      transform: 'translateX(-50%)', // Perfectly centers based on text width
      color: 'black', 
      fontSize: '2.5rem', 
      zIndex: 1, 
      fontFamily: '"Courier New", Courier, monospace', // Scientific Monospace font
      letterSpacing: '2px',   // Adds a clean, modern look
      textTransform: 'uppercase', 
      pointerEvents: 'none',   // Ensures you can still click 3D boxes
      margin: 0
    }}>
      Epidermis Layers
    </h1>

        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} />

          <Suspense fallback={null}>
            {/* 1. STRATUM BASALE */}
            <Box 
              position={[-8, 0, 0]} 
              size={[2.5, 0.5, 2.5]} 
              color="#ffb3c1" 
              title="Stratum Basale"
              thickness="1 cell layer"
              cellType="Basal cells (stem cells), Melanocytes"
              description="Deepest layer where constant cell division occurs to produce new keratinocytes." 
            />

            {/* 2. STRATUM SPINOSUM */}
            <Box 
              position={[-4, 0, 0]} 
              size={[2.5, 2.5, 2.5]} 
              color="#ff8fa3" 
              title="Stratum Spinosum"
              thickness="8-10 cell layers"
              cellType="Keratinocytes, Langerhans cells"
              description="The 'spiny' layer providing strength and immune protection." 
            />

            {/* 3. STRATUM GRANULOSUM */}
            <Box 
              position={[0, 0, 0]} 
              size={[2.5, 1.2, 2.5]} 
              color="#c9184a" 
              title="Stratum Granulosum"
              thickness="3-5 cell layers"
              cellType="Flattened keratinocytes"
              description="Cells begin to flatten and produce large amounts of keratin and lipid-rich granules." 
            />

            {/* 4. STRATUM LUCIDUM */}
            <Box 
              position={[4, 0, 0]} 
              size={[2.5, 0.3, 2.5]} 
              color="#f8edeb" 
              title="Stratum Lucidum"
              thickness="2-3 cell layers"
              cellType="Dead, clear keratinocytes"
              description="A clear, thin layer found only in thick skin like the palms and soles." 
            />

            {/* 5. STRATUM CORNEUM */}
            <Box 
              position={[8, 0, 0]} 
              size={[2.5, 2.0, 2.5]} 
              color="#800f2f" 
              title="Stratum Corneum"
              thickness="20-30 cell layers"
              cellType="Dead, flattened keratinocytes (Corneocytes)"
              description="The outermost waterproof barrier consisting of dead cells filled with keratin." 
            />
          </Suspense>

          <OrbitControls enableZoom={false} enableRotate={true} enablePan={false}  />
        </Canvas>
    </div>
   </>
  );
}

export default Skin;
