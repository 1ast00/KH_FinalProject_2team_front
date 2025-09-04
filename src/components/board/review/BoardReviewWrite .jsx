import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/toastui-editor.css";
import styles from "../../../css/board/BoardReviewWrite.module.css";
import axios from "axios";

// EditorNomarl 컴포넌트를 이 파일 내부에 정의
const EditorNomarl = ({ editorRef }) => {
  const imageApiUrl = "/api/uploadImage";

  const onBeforeAddImage = (file, callback) => {
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(imageApiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const imageUrl = response.data.imageUrl;
        callback(imageUrl, "이미지 설명");
      })
      .catch((error) => {
        console.error("이미지 업로드 실패", error);
        alert("이미지 업로드에 실패했습니다.");
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
      const content = editorInstance.getMarkdown(); // 에디터의 최종 마크다운 콘텐츠를 가져옴

      if (!title.trim()) {
        alert("제목을 입력해주세요");
        return;
      }

      // JSON만 백엔드 전송, 이미지는 토스트UI 훅으로 업로드 콘텐츠에 이미지 URL 포함.
      const response = await axios.post("/api/reviews/write/no-file", {
        brtitle: title,
        brcontent: content,
      });

      console.log("글작성 성공", response.data);
      navigate("/boardAllview");
    } catch (error) {
      console.log("글작성 실패", error);
      alert("글 작성에 실패했습니다. 관리자에게 문의하세요.");
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