export default ({currentPage,dataLength,pageSize,onPageChange,searchPerformed}) => {
    
    // console.log("currentPage in Pagination.jsx",currentPage);
    console.log("dataLength in Pagination.jsx",dataLength);
    // console.log("pageSize in Pagination.jsx",pageSize);
    // console.log("onPageChange in Pagination.jsx",onPageChange);

    const hasNext = dataLength === pageSize;
    const hasPrev = currentPage > 1;

    return(
        <div>
            {hasPrev && currentPage > 2 && (<button onClick={() => onPageChange(currentPage =1)}> &lt&lt </button>)}
            {hasPrev && (<button onClick={() => onPageChange(currentPage -1)}> &lt </button>)}
            {dataLength !== 0 && searchPerformed  && (<button onClick={() => onPageChange(currentPage)}>{currentPage}</button>)}
            {hasNext && (<button onClick={() => onPageChange(currentPage +1)}> &gt </button>)}
        </div>
    );
}