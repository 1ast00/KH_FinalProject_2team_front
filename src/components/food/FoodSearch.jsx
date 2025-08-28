export default ({query, setQuery, handleSearch}) => {
    
    return(
        <div>
        <input type="text" 
        placeholder="원하시는 식품을 입력하세요." 
        value={query} 
        onChange={e=>{setQuery(e.target.value)}}/>
        <button onClick={handleSearch}>검색</button>
        </div>
    );
}