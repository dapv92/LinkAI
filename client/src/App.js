import { useState } from "react";
function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(false);
  const [imageDescription, setImageDescription] = useState(null);

  const requestImage = async (e) =>{
    e.preventDefault();
    console.log(prompt);
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5500/openai',{
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({prompt}),
      });
      if (!response.ok) {
        throw new Error("error al generar la imagen");
      }
      const data = await response.json();
      if (data.textError == true) {
        alert("No se ha podido entender el texto o este tiene alguna palabra no permitida");
      }
      setImageUrl(data.data);
      setImageDescription(imageDescription)
    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false);
      setPrompt("")
    }
  }
  return (
    <div className="">
      <h1>IMG App</h1>
      <form onSubmit={requestImage}>
        <label>¿Que deseas crear?</label>
        <textarea name="imgBus" id="imgBus" cols="30" rows="10" value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
        <button>{loading ? "Generando..." : "Generar imagen"}</button>
      </form>
      {imageUrl && (
        <img src={imageUrl} alt={prompt} />
      )}
     </div>
  );
}

export default App;
