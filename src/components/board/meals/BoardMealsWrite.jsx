import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/toastui-editor.css";
import styles from "../../../css/board/BoardMealswWrite.module.css";
import axios from "axios";

// EditorNomarl 컴포넌트를 이 파일 내부에 정의
const EditorNomarl = ({ editorRef }) => {
  const imageApiUrl = "/api/uploadImage"; // 이미지 업로드 API URL

  const onBeforeAddImage = (file, callback) => {
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(imageApiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      ref={editorRef} // props로 받은 ref를 그대로 사용
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
  // 파일 상태 추가
  const [files, setFiles] = useState([]); 

  const handleAddWrite = async () => {
    try {
      const editorInstance = editorRef.current.getInstance();
      const content = editorInstance.getMarkdown();

      if (!title.trim()) {
        alert("제목을 입력해주세요");
        return;
      }
      
      let response;

      if (files.length > 0) {
        // 파일이 있는 경우
        const formData = new FormData();
        formData.append(
          "params",
          JSON.stringify({ brtitle: title, brcontent: content })
        );
        files.forEach((file) => formData.append("files", file));

        response = await axios.post("/api/reviews/write/with-file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // 파일이 없는 경우
        response = await axios.post("/api/reviews/write/no-file", {
          brtitle: title,
          brcontent: content,
        });
      }

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
        {/* EditorNomarl 컴포넌트를 사용하고 ref를 props로 전달 */}
        <EditorNomarl editorRef={editorRef} />
      </div>
    </div>
  );
};