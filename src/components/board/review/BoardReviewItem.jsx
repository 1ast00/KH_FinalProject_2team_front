import React from "react";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import styles from "../../../css/board/BoardReviewItem.module.css";

export default ({ review }) => {
  return (
    <div className={styles.item}>
      <h3>{review.brtitle}</h3>
      <Viewer initialValue={review.brcontent} />
      <p>조회수: {review.brviewcount}</p>
      <p>작성일: {new Date(review.brwrite_date).toLocaleDateString()}</p>
    </div>
  );
};
