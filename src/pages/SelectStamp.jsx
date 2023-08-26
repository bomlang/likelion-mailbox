import SearchBar from "@/components/SearchBar";
import Header from "@/layout/header";
import { useState } from "react";
import { useEffect } from "react";
import PocketBase from "pocketbase";
import { toast } from "react-hot-toast";

function SelectStamp() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("cat");

  const handleSearch = (searchValue) => {
    setQuery(searchValue);
  };

  useEffect(() => {
    const KEY = import.meta.env.VITE_GIPHY_API_KEY;
    const URL = `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${KEY}&limit=16`;

    fetch(URL)
      .then((res) => res.json())
      .then((response) => {
        if (response.data) {
          setData(response.data);
        } else {
          console.log("Invalid data structure in API response");
        }
      })
      .catch((error) => console.log(error));
  }, [query]);

  const handleGifDataPatch = async (e) => {
    const clickGIF = e.target.src;

    const updatedData = {
      gifStamp: clickGIF,
    };

    // 💡 updata에 임시 userID를 넣어놨습니다. 로그인시 userID를 가져오는 기능구현이 필요합니다!
    const pb = new PocketBase("https://likelion-mailbox.pockethost.io");
    const record = await pb
      .collection("test_message")
      .update("mkk5rmyoplcj8o8", updatedData);
    // const stampData = [...record];
    if (record) {
      toast.success("이미지 저장에 성공하였습니다! ✅");
    } else {
      toast.error("서버와의 통신에 문제가 발생하였습니다. ❌");
    }
  };

  // 공부기록
  //   fetch(URL)
  //   .then((res) => res.json())
  //   .then((data) => {
  //     if (data) {
  //       setData(data.data);
  //       console.log(data.data);
  //     }
  //   })
  //   .catch((error) => console.log(error));
  // }, []);

  return (
    <>
      <Header text={"움직이는 우표를 골라보세요!"} featText={"(feat.GIPHY)"} />
      <SearchBar
        searchText={"GIF이미지 검색이 가능합니다! ex) cat"}
        onSearch={handleSearch}
      />
      <div className="flex flex-wrap justify-center">
        {data &&
          data.map((item) => (
            <div
              key={item.id}
              className="m-2 flex justify-center border-2 border-solid rounded-md my-5"
            >
              <img
                src={item.images.original.url}
                alt="GIF"
                width="180"
                height="170"
                onClick={handleGifDataPatch}
              />
            </div>
          ))}
      </div>
    </>
  );
}

export default SelectStamp;
