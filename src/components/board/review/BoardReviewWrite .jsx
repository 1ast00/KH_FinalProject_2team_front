import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/toastui-editor.css";
import styles from "../../../css/board/BoardReviewWrite.module.css";
import { reviewsAPI } from "../../../service/boardApi";

// EditorNomarl 컴포넌트는 컴포넌트 내부에 정의되어 있으므로 그대로 둡니다.
const EditorNomarl = ({ editorRef, initialValue }) => {
  const imageApiUrl = "/api/reviews/uploadImage";

  const onBeforeAddImage = (file, callback) => {
    const formData = new FormData();
    formData.append("file", file);

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
      initialValue={initialValue}
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
export default function BoardReviewWrite() {
  const navigate = useNavigate();
  const { brno } = useParams(); // useParams()를 여기에 둡니다.
  const location = useLocation(); // useLocation()를 여기에 둡니다.
  const editorRef = useRef();
  const [title, setTitle] = useState("");

  useEffect(() => {
    // 수정 모드일 때 (brno가 존재할 때)
    if (brno && location.state?.review) {
      const { brtitle, brcontent } = location.state.review;
      setTitle(brtitle);
      if (editorRef.current) {
        editorRef.current.getInstance().setMarkdown(brcontent);
      }
    }
  }, [brno, location.state]);

  const handleSubmit = async () => {
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
      };

      let response;
      if (brno) {
        //수정(PATCH)
        response = await reviewsAPI.patch(`/update/${brno}`, reviewData);
        alert(response.data.msg);
      } else {
        //작성(POST)
        response = await reviewsAPI.post("/write", reviewData);
        alert("게시글이 성공적으로 작성되었습니다.");
      }

      if (response.data.code === 1) {
        navigate(`/board/review/${brno || response.data.brno}`);
      }
    } catch (error) {
      console.error("글 작성 실패:", error.response || error);
      alert("글 작성에 실패했습니다. 로그인 상태를 확인해 주세요.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.btn_gap}>
        <div>
          <button className={styles.btn_addwrite} onClick={handleSubmit}>
            {brno ? "수정 완료" : "+ 작성 완료"}
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
        <EditorNomarl
          editorRef={editorRef}
          initialValue={brno ? "" : "Vitalog를 사용후기를 부탁합니다."}
        />
      </div>
    </div>
  );
};
