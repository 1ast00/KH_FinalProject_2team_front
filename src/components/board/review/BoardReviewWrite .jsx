import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/toastui-editor.css";
import styles from "../../../css/board/BoardReviewWrite.module.css";
//import axios from "axios";
import { reviewsAPI } from "../../../service/boardApi";

const EditorNomarl = ({ editorRef }) => {
  const imageApiUrl = "/api/reviews/uploadImage";

  const onBeforeAddImage = (file, callback) => {
    const formData = new FormData();
    formData.append("file", file); // axios 대신 reviewsAPI 사용

    reviewsAPI
      .post(imageApiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const imageUrl = response.data.imageUrl;
        callback(imageUrl, "이미지 설명");
      })
      .catch((error) => {
        console.error("이미지 업로드 실패:", error.response || error);
        alert("이미지 업로드에 실패했습니다. 로그인 상태를 확인해 주세요.");
      });
  };

  return (
    <Editor
      ref={editorRef}
      initialValue="Vitalog를 사용하며 좋았던 점을 적어주세요"
      previewStyle="Editer"
      height="500px"
      initialEditType="wysiwyg"
      useCommandShortcut={false}
      hideModeSwitch={true}
      hooks={{
        addImageBlobHook: (blob, callback) => {
          onBeforeAddImage(blob, callback);
          return false;
        },
      }}
    />
  );
};

// 메인 컴포넌트 (BoardReviewWrite)
export default () => {
  const navigate = useNavigate();
  const editorRef = useRef();
  const [title, setTitle] = useState("");

  const handleAddWrite = async () => {
    try {
      const editorInstance = editorRef.current.getInstance();
      const content = editorInstance.getMarkdown();

      if (!title.trim()) {
        alert("제목을 입력해주세요");
        return;
      }

      const reviewData = {
        brtitle: title,
        brcontent: content,
      }; // reviewsAPI를 사용하여 글 작성 요청

      const response = await reviewsAPI.post("/write", reviewData);

      console.log("글 작성 성공", response.data);
      alert("게시글이 성공적으로 작성되었습니다.");
      navigate("/board/review");
    } catch (error) {
      console.error("글 작성 실패:", error.response || error);
      alert("글 작성에 실패했습니다. 로그인 상태를 확인해 주세요.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.btn_gap}>
        <div>
          <button className={styles.btn_addwrite} onClick={handleAddWrite}>
             + 작성완료 
          </button>
          
        </div>
        
        <div>
          
          <button className={styles.btn_back} onClick={() => navigate(-1)}>
            {`<`} 뒤로가기 
          </button>
        </div>
      </div>
      
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.titleInput}
      />
      
      <div className={styles.contentArea}>
         <EditorNomarl editorRef={editorRef} />
      </div>
      
    </div>
  );
};