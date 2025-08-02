import { useState } from "react";
import Button from "../common/button";
import "./search.css";

type SearchProps = {
  onSearch: (search: string) => void;
  useButton?: boolean;
  height?: string;
  width?: string;
};

function Search({ onSearch, useButton = true, height, width }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  function handleSearch(e: React.FormEvent<HTMLElement>, value?: string) {
    e.preventDefault();
    value !== undefined ? onSearch(value) : onSearch(searchQuery);
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (useButton) {
      setSearchQuery(e.currentTarget.value ?? "");
    } else {
      setSearchQuery(e.currentTarget.value ?? "");
      handleSearch(e, e.currentTarget.value ?? "");
    }
  }
  return (
    <form className="search-container" onSubmit={handleSearch}>
      <input
        style={{
          height: height ? height + "px" : undefined,
          width: width ? width + "px" : undefined,
        }}
        className="search-bar"
        type="search"
        placeholder="search..."
        onChange={(e) => {
          handleOnChange(e);
        }}
      ></input>
      {useButton && (
        <Button className="btn-search" onClick={handleSearch}>
          S
        </Button>
      )}
    </form>
  );
}

export default Search;
