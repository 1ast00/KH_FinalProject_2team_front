export default ({currentPage,dataLength,pageSize,onPageChange,searchPerformed,totalCount}) => {
    
    // console.log("currentPage in Pagination.jsx",currentPage);
    // console.log("dataLength in Pagination.jsx",dataLength);
    // console.log("pageSize in Pagination.jsx",pageSize);
    // console.log("onPageChange in Pagination.jsx",onPageChange);

    const hasNext = dataLength === pageSize;
    const hasPrev = currentPage > 1;
    const hasLast = (currentPage*5 + dataLength !== totalCount);

    const lastPage = Math.floor(totalCount/pageSize) + 1;

    return(
        <div>
            {hasPrev && currentPage > 2 && (<button onClick={() => onPageChange(currentPage =1)}> {"<<"} </button>)}
            {hasPrev && (<button onClick={() => onPageChange(currentPage -1)}> {"<"} </button>)}
            {dataLength !== 0 && searchPerformed  && (<button onClick={() => onPageChange(currentPage)}>{currentPage}</button>)}
            {hasNext && (<button onClick={() => onPageChange(currentPage +1)}> {">"} </button>)}
            { !!searchPerformed && currentPage !== lastPage && hasLast && (<button onClick={() => onPageChange(currentPage = (lastPage))}> {">>"} </button>)}
        </div>
    );
}