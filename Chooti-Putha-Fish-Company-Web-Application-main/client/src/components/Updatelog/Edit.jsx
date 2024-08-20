import React, { useEffect, useState } from 'react';
import { Link,useNavigate, useParams } from 'react-router-dom';
import "../Addlog/Add.css";
import axios from 'axios';
import toast from 'react-hot-toast';
// import Catch from '../Getlog/Catch';
import formimg1 from "../../backgroundimage/Catch_formimg1.jpeg";
import formimg2 from "../../backgroundimage/Catch_formimg2.jpeg";
import formimg3 from "../../backgroundimage/Catch_formimg3.jpg";

const Editlogs = () => {
  
    const [catchData , setCatch] = useState({
        fishType:"",
        grade:"",
        method_of_catch:"",
        caught_quantity:"",
        released_quantity:"",
        available_stock:""
        // availability:""
    });
    
  const  {id} = useParams();
  const navigate = useNavigate();
  const [isFormEmpty, setIsFormEmpty] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const images = [formimg1, formimg2, formimg3];

  const updateImageIndex = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % images.length); // Mod by the total number of images
  };

  useEffect(() => {
    const intervalId = setInterval(updateImageIndex, 3000);
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    // Update available_stock whenever caught_quantity or released_quantity changes
    const updateAvailableStock = () => {
      const { caught_quantity, released_quantity } = catchData;
      if (caught_quantity !== '' && released_quantity !== '') {
        const availableStock = parseFloat(caught_quantity) - parseFloat(released_quantity);
        setCatch(prevState => ({ ...prevState, available_stock: availableStock.toString() }));

        // const availability = availableStock > 0 ? 'Yes' : 'No';
        // setCatch((prevState) => ({ ...prevState, availability: availability }));
      }
    };

    updateAvailableStock();
  }, [catchData.caught_quantity, catchData.released_quantity]);

  const inputChangeHandler = (e)=>{
    const{name,value} = e.target;
    let errorMessage = '';
   
    // if (name === 'fishType' && !validateFishType(value)) {
    //     errorMessage = 'Fish Type should contain only alphabetic characters.';
    // } else 
    if (name === 'grade' && !validateFishGrade(value)) {
      errorMessage = 'Invalid Grade. Please enter A, B, or C.';
  } else if (name === 'method_of_catch' && value === '') {
      errorMessage = 'Method of catch must be selected.';
  } else if (name === 'caught_quantity' && (isNaN(value) && !validateCaught(value) || parseInt(value) <= 0)) {
      errorMessage = 'Caught Quantity should be a positive number.';
  } else if (name === 'released_quantity' && (isNaN(value) && !validateRelease(value) || parseInt(value) <= 0)) {
      errorMessage = 'Released Quantity should be a positive number.';
  }


    // setCatch({...catchData,[name]:value});
    setCatch({...catchData,[name]:value, errorMessage});
    // setCatch((prevState) => ({ ...prevState, [name]: value, errorMessage }));
    if (errorMessage !== '') {
      toast.error(errorMessage, { position: 'top-center' });
    }
    console.log(catchData)
  }

  const gradeinputHandler = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^A-Ca-c]/g, '').toUpperCase().slice(0, 1); // Extract only A, B, or C and convert to uppercase
    setCatch({ ...catchData, [name]: filteredValue });
}

const handlegradeInputChange = (event) => {
  const { value } = event.target;
  validateFishGrade(value);
};

const caughtinputHandler = (e) => {
  const { name, value } = e.target;
  const filteredValue = value.replace(/[^0-9.]/g, ''); // Allow digits and '.' only
  setCatch({ ...catchData, [name]: filteredValue });
}

const validateCaught = (value) => {
  if (!/^\d+(\.\d+)?$/.test(value)) {
      toast.error('\''+value+'\''+' is an invalid Quantity.', {
          position: 'top-center',
          autoClose: 1000,
          toastId: 'invalid-Quantity-error' // Ensure a unique toastId to prevent duplicates
      });
      return false;
  }

  return true;
}

const handlecaughtInputChange = (event) => {
  const { value } = event.target;
  validateCaught(value);
};

const releaseinputHandler = (e) => {
  const { name, value } = e.target;
  const filteredValue = value.replace(/[^0-9.]/g, ''); // Allow digits and '.' only
  setCatch({ ...catchData, [name]: filteredValue });
}

const validateRelease = (value) => {
  if (!/^\d+(\.\d+)?$/.test(value)) {
      toast.error('\''+value+'\''+' is an invalid Quantity.', {
          position: 'top-center',
          autoClose: 1000,
          toastId: 'invalid-Release-error' // Ensure a unique toastId to prevent duplicates
      });
      return false;
  }

  return true;
}

const handlereleaseInputChange = (event) => {
  const { value } = event.target;
  validateRelease(value);
};

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/catch/getonecatch/${id}`)
    .then((response)=>{
        setCatch(response.data)
    }).catch((error)=>{
        console.log(error);
    })
  },[id])

  // const validateFishType = value => {
  //   // Regular expression to match only alphabetic characters
  //   const regex = /^[A-Za-z]+$/;
  //   return regex.test(value);
  // };


  const validateFishGrade = (value) => {
    // Allowed fish grades
    const allowedGrades = ['A', 'B', 'C'];
    if(/[^A-Ca-c]/.test(value.charAt(0))){
        toast.error(`\'${value}\' is an Invalid Grade! Grade can only contain A, B, or C.`, {
            position: 'top-center',
            autoClose: 1000,
            toastId: 'invalid-grade-error' // Ensure a unique toastId to prevent duplicates
        });
        return false;
    }
    // Check if the entered value is not allowed
    if (!allowedGrades.includes(value.toUpperCase())) {
        // Display an error toast message
        toast.error(`\'${value}\' is an Invalid Grade! Grade can only contain A, B, or C.`, {
            position: 'top-center',
            autoClose: 1000,
            toastId: 'invalid-gre-error' // Ensure a unique toastId to prevent duplicates
        });
        return false;
    }

    // Check if the entered value is exactly one character and in the allowed grades
    return value.length === 1;
}


  const submitForm =async(e)=>{
    e.preventDefault();

    if (isFormEmpty) {
      toast.error('Please fill out all fields before submitting.', { position: 'top-center' });
      return;
    }

    // if (!validateFishType(catchData.fishType)) {
    //     toast.error('Fish Type should contain only alphabetic characters.', { position: 'top-center' });
    //     return;
    // }

    if (!validateFishGrade(catchData.grade)) {
        toast.error("Invalid Grade. Please enter A, B or C.", {position:"top-center"});
        return;
    }

    if ((catchData.method_of_catch) == "") {
      toast.error('Method of catch must be selected.', { position: 'top-center' });
      return;
    }

    if (parseInt(catchData.available_stock) < 0) {
      toast.error('Not enough Stock to be released.', { position: 'top-center' });
      return;
    }

    await axios.put(`http://localhost:4000/api/catch/updatecatch/${id}`,catchData)
        .then((response)=>{
            toast.success(response.data.msg, {position:"top-right"})
            navigate("/Catchlog")
        }).catch(error => console.log(error))
  }

  useEffect(() => {
    // Check if all fields are empty
    const checkFormEmpty = () => {
      for (const key in catchData) {
        if (catchData[key] !== '') {
          setIsFormEmpty(false);
          return;
        }
      }
      setIsFormEmpty(true);
    };

    checkFormEmpty();
  }, [catchData]);

  return (
    <div className='addlog'>
      <div className="Catch_container">
      <div className="Catch_image-container">
            
            <img
                src={images[imageIndex]}
                alt="Fish Image"
                className="Catch_fish-image"
            />
        
        </div>
        <div className="Catch_form-container">
            <div className="Catch_header">
              <h2 id="Catch_form-title">Update Log</h2>
            </div>
            <form className='addLogForm' onSubmit={submitForm}>
                <div className='Catch_inputGroup'>
                    <label htmlFor="fishType">Fish Type</label> <br />
                    {/* <input type='text'value={catchData.fishType} onChange={inputChangeHandler} id="fishType" name="fishType" autoComplete='off' placeholder='Fish Type'/> */}
                    <select onChange={inputChangeHandler} value={catchData.fishType} name="fishType" id="fishType">
                        <option value="Seer">Seer</option>
                        <option value="Paraw">Paraw</option>
                        <option value="Tuna">Tuna</option>
                        <option value="Blood_fish">Blood Fish</option>
                        <option value="Sharks">Sharks</option>
                        <option value="Skate">Skate</option>
                        <option value="Galmalu">Rock Fish(Galmalu)</option>
                        <option value="Shore_Seinen">Shore Seine</option>
                        <option value="Prawns">Prawns</option>
                        <option value="Lobster">Lobster</option>
                        <option value="Squids">Squids</option>
                        <option value="Crabs">Crabs</option>
                        <option value="Small_Fish">Small Fish</option>
                    </select>
                </div>
                <div className='Catch_inputGroup'>
                    <label htmlFor="grade">Grade</label> <br /> 
                    <input type='text' onChange={(event) => {gradeinputHandler(event); handlegradeInputChange(event);}} value= {catchData.grade} id="grade" name="grade" autoComplete='off' placeholder='Grade'/>
                </div>
                <div className='Catch_inputGroup'>
                        <label htmlFor="method_of_catch">Method of catch</label> <br />
                        <select onChange={inputChangeHandler} value= {catchData.method_of_catch} id="method_of_catch" name="method_of_catch">
                            <option value="">Select Method</option>
                            <option value="Net">Net</option>
                            <option value="Fish trap">Fish trap</option>
                            <option value="Cast net">Cast net</option>
                            <option value="Trotline">Trotline</option>
                        </select>
                </div>
                {/* <div className='inputGroup'>
                    <label htmlFor="method_of_catch">Method of catch</label>
                    <input type='text' value= {catchData.method_of_catch} onChange={inputChangeHandler} id="method_of_catch" name="method_of_catch" autoComplete='off' placeholder='Method of catch'/>
                </div> */}
                <div className='Catch_inputGroup'>
                    <label htmlFor="caught_quantity">Caught Quantity(Kg)</label> <br />
                    <input type='text' onChange={(event) => {caughtinputHandler(event); handlecaughtInputChange(event);}} value={catchData.caught_quantity} id="caught_quantity" name="caught_quantity" autoComplete='off' placeholder='Caught Quantity'/>
                </div>
                <div className='Catch_inputGroup'>
                    <label htmlFor="released_quantity">Released Quantity(Kg)</label> <br />
                    <input type='text' onChange={(event) => {releaseinputHandler(event); handlereleaseInputChange(event);}} value={catchData.released_quantity} id="released_quantity" name="released_quantity" autoComplete='off' placeholder='Released Quantity'/>
                </div>
                <div className='Catch_inputGroup'>
                    <label htmlFor="available_stock">Available Stock(Kg)</label> <br />
                    <input type='text' value= {catchData.available_stock} onChange={inputChangeHandler} id="available_stock" name="available_stock" autoComplete='off' placeholder='Available Stock' readOnly/>
                </div>
                {/* <div className='inputGroup'>
                    <label htmlFor="availability">Availability</label>
                    <input type='text' value= {catchData.availability} id="availability" name="availability" onChange={inputChangeHandler} autoComplete='off' placeholder='Availability of fish' disabled/>
                </div> */}
                <div className='Catch_inputGroup'>
                    <center>
                      <button type="submit" className='Catch_submitButton'>Update Log</button>
                    </center>
                </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default Editlogs