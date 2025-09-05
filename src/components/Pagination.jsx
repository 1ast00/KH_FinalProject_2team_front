import styles from "../../src/css/Pagination.module.css"

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
        <div className={styles.buttonBar}>
            {hasPrev && currentPage > 2 && (<button onClick={() => onPageChange(currentPage =1)} className={styles.butttonsAtBothEnd}> {"<<"} </button>)}
            {hasPrev && (<button onClick={() => onPageChange(currentPage -1)} className={styles.buttonsAround}> {"<"} </button>)}
            {dataLength !== 0 && searchPerformed  && (<button onClick={() => onPageChange(currentPage)} className={styles.currentPage}>{currentPage}</button>)}
            {hasNext && (<button onClick={() => onPageChange(currentPage +1)} className={styles.buttonsAround}> {">"} </button>)}
            { !!searchPerformed && currentPage !== lastPage && hasLast && (<button onClick={() => onPageChange(currentPage = (lastPage))} className={styles.butttonsAtBothEnd}> {">>"} </button>)}
        </div>
    );
}