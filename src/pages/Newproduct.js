import React, { useState } from "react";
import { BsUpload } from "react-icons/bs";
import { imagetoBase64 } from "../utility/imagetoBase64";
import { toast } from "react-hot-toast";
import LeftNav from "../Navbar";

//This file deals with uploading of products to the database and its front end view{admin}
const Newproduct = () => {
  const list = [{link:"admin-home",value:"Home"},{link:"newproduct",value:"Add Product"},{link:"all-orders",value:"All Orders"},{link:"login",value:"Logout"}]
  const [data, setData] = useState({
    name: "",
    category: "",
    image: "",
    price: "",
    description: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const uploadImage = async (e) => {
    console.log(e.files);
    const data = await imagetoBase64(e.target.files[0]);
    //console.log(data)
    setData((preve) => {
      return {
        ...preve,
        image: data,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    const { name, image, category, price } = data;
    if (name && image && category && price) {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/uploadProduct`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const fetchRes = await fetchData.json();
      console.log(fetchRes);
      toast(fetchRes.message)

      setData(()=>{
        return{
    name : "",
    category : "",
    image : "",
    price : "",
    description : "",
  }
});
}
    else
    {
      toast("Enter required fields")
    }
  };

  return (
    //new product form
    <div className="p-4">
      <LeftNav options = {list}/>
      <form
        className="m-auto w-full max-w-md shadow flex flex-col p-3 bg-white"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Name </label>
        <input
          type={"text"}
          name="name"
          className="bg-slate-200 p-1 "
          onChange={handleOnChange}
          value={data.name}
        ></input>

        <label htmlFor="category">Category</label>
        <select
          className="bg-slate-200 p-1 my-1"
          id="category"
          name="category"
          onChange={handleOnChange}
          value={data.category}
        >
        <option value={""}>select</option>
         <option value={"electronics"}>Electronics</option>
          <option value={"clothing"}>Clothing</option>
          <option value={"books"}>Books</option>
          <option value={"home-appliances"}>Home Appliances</option>
          <option value={"toys"}>Toys</option>
          <option value={"sports"}>Sports Equipment</option>
          <option value={"beauty"}>Beauty Products</option>
          <option value={"furniture"}>Furniture</option>
          <option value={"jewelry"}>Jewelry</option>

        </select>

        <label htmlFor="image">
          Image
          <div className="h-40 w-full bg-slate-200 rounded flex items-center justify-center cursor-pointer">
            {data.image ? (
              <img src={data.image} className="h-full " />
            ) : (
              <span className="text-3xl">
                <BsUpload />
              </span>
            )}

            <input
              type={"file"}
              accept="image/"
              id="image"
              onChange={uploadImage}
              className="hidden"
            />
          </div>
        </label>
        <label htmlFor="price" className="my-1">
          Price
        </label>
        <input
          type={"text"}
          className="bg-slate-200 p-1 my-1 "
          name="price"
          onChange={handleOnChange}
          value={data.price}
        />
        <label htmlFor="description">Description</label>
        <textarea
          value={data.description}
          rows={2}
          className="bg-slate-200 p-1 my-1 resize-none"
          name="description"
          onChange={handleOnChange}
        ></textarea>

        <button className="bg-red-400 hover:bg-red-500 text-white text-lg-medium my-1 font-bold drop-shadow">
          Save
        </button>
      </form>
    </div>
  );
};

export default Newproduct;
