import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/toastui-editor.css";
import styles from "../../../css/board/BoardMealsWrite.module.css";
import { mealsAPI } from "../../../service/boardApi";

const EditorNomarl = ({ editorRef, initialValue }) => {
  const imageApiUrl = "/api/meals/uploadImage";

  const onBeforeAddImage = (file, callback) => {
    const formData = new FormData();
    formData.append("file", file);

    mealsAPI
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

//게시글작성
export default function BoardMealsWrite() {
  const navigate = useNavigate();
  const { bmno } = useParams();
  const location = useLocation();
  const editorRef = useRef();
  const [title, setTitle] = useState("");

  useEffect(() => {
    //수정 모드
    if (bmno && location.state?.meal) {
      const { bmtitle, bmcontent } = location.state.meal; // 
      setTitle(bmtitle);
      if (editorRef.current) {
        editorRef.current.getInstance().setMarkdown(bmcontent);
      }
    }
  }, [bmno, location.state]);

  const handleSubmit = async () => {
    try {
      const editorInstance = editorRef.current.getInstance();
      const content = editorInstance.getMarkdown();

      if (!title.trim()) {
        alert("제목을 입력해주세요");
        return;
      }

      //서버 전송
      const mealData = {
        bmtitle: title,
        bmcontent: content,
      };

      let response;
      if (bmno) {
        // 수정(PATCH)
        response = await mealsAPI.patch(`/update/${bmno}`, mealData);
        alert(response.data.msg);
      } else {
        // 작성(POST)
        response = await mealsAPI.post("/write", mealData);
        alert("게시글이 성공적으로 작성되었습니다.");
      }

      if (response.data.code === 1) {
        navigate(`/board/meals/${bmno || response.data.bmno}`);
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
            {bmno ? "수정 완료" : "+ 작성 완료"}
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
          initialValue={bmno ? "" : "식단정보를 공유해 볼까요?"}
        />
      </div>
    </div>
  );
}
