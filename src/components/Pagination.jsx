import styles from "../../src/css/Pagination.module.css"

export default ({currentPage,dataLength,pageSize,onPageChange,searchPerformed,totalCount}) => {

    const lastPage = Math.ceil(totalCount / pageSize);

    if (!searchPerformed || dataLength === 0) return null;

    // 버튼에 표시할 페이지 번호 계산
    let pageNumbers = [];

    if (currentPage === 1) {
        pageNumbers = [1, 2, 3, 4].filter(p => p <= lastPage);
    } else if (currentPage === 2) {
        pageNumbers = [1, 2, 3, 4].filter(p => p <= lastPage);
    } else if (currentPage >= 3 && currentPage <= lastPage - 2) {
        pageNumbers = [currentPage - 1, currentPage, currentPage + 1, currentPage + 2].filter(p => p <= lastPage);
    } else if (currentPage === lastPage - 1) {
        pageNumbers = [lastPage - 3, lastPage - 2, lastPage - 1, lastPage].filter(p => p > 0);
    } else if (currentPage === lastPage) {
        pageNumbers = [lastPage - 3, lastPage - 2, lastPage - 1, lastPage].filter(p => p > 0);
    }

    const hasPrev = currentPage > 1;
    const hasNext = currentPage < lastPage;

    return (
        <div className={styles.buttonBar}>
        {/* << 버튼 */}
        {hasPrev && currentPage > 2 && (
            <button onClick={() => onPageChange(1)} className={styles.butttonsAtBothEnd}>
            {"<<"}
        </button>
        )}

        {/* < 버튼 */}
        {hasPrev && (
            <button onClick={() => onPageChange(currentPage - 1)} className={styles.buttonsAround}>
            {"<"}
        </button>
        )}

        {/* 페이지 번호 버튼 */}
        {pageNumbers.map((p) => (
            <button
            key={p}
            onClick={() => onPageChange(p)}
            className={p === currentPage ? styles.currentPage : ""}
        >
          {p}
        </button>
        ))}

        {/* > 버튼 */}
        {hasNext && (
            <button onClick={() => onPageChange(currentPage + 1)} className={styles.buttonsAround}>
            {">"}
            </button>
        )}

        {/* >> 버튼 */}
        {hasNext && currentPage < lastPage - 1 && (
            <button onClick={() => onPageChange(lastPage)} className={styles.butttonsAtBothEnd}>
            {">>"}
            </button>
        )}
    </div>
  );
}