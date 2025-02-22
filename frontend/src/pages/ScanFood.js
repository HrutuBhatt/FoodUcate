import React, {useState} from 'react';
const ScanFood = ()=>{
    const [foodDetails, setFoodDetails] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setSelectedImage(file);
          setFoodDetails(null); 
          setError("");
        }
    };

    const handleUpload = async()=>{
        if(!selectedImage){
            setError("Please select image first.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedImage);
        setLoading(true);
        setError("");
        setFoodDetails(null);

        try{
            const response = await fetch("http://localhost:5000/upload",{
                method : 'POST',
                body : formData
              
            });
            const data = await response.json();
            if(response.ok){
                setFoodDetails(data);
            } else{
                setError(data.error || "Something went wrong");
            }
        }
        catch(error){
            setError("Failed to upload image.");
        }

        setLoading(false);
    };

    return (
        <div className="container mt-5">
        <h2 className="text-center">Scan Food for Nutritional Information</h2>
  
        <div className="mb-3">
          <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
        </div>
  
        {selectedImage && (
          <div className="text-center mb-3">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="img-fluid rounded"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </div>
        )}
  
        <button className="btn btn-primary w-100" onClick={handleUpload} disabled={loading}>
          {loading ? "Scanning..." : "Scan Food"}
        </button>
  
        {error && <div className="alert alert-danger mt-3">{error}</div>}
  
        {foodDetails && (
          <div className="alert alert-info mt-3" dangerouslySetInnerHTML={{ __html: foodDetails }} />
        )}
      </div>
    )
}

export default ScanFood;