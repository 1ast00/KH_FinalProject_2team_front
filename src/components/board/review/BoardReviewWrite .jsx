import React, { forwardRef, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/toastui-editor.css";
import styles from "../../../css/board/BoardReviewWrite.module.css";
import axios from "axios"; 

const EditorNomarl = forwardRef((props, ref) => {
  return (
    <Editor
      ref={ref}
      initialValue="Vitalog를 사용하며 좋았던 점을 적어주세요"
      previewStyle="Editer"
      //width="1200px"
      height="500px"
      initialEditType="wysiwyg"
      useCommandShortcut={false}
      hideModeSwitch={true}
    />
  );
});

export default () => {
  const navigate = useNavigate();
  const editorRef = useRef(); //add25.09.01
  const [title, setTitle] = useState('');

  const handleAddWrite = async  () => {
    try{
      const editorInstance = editorRef.current.getInstance();
      const content = editorInstance.getMarkdown();

      if(!title.trim()){
        alert('제목을 입력해주세요');
        return;
      }
      const response = await axios.post('/api/reviews/write',{
        title: title,
        content: content,
      });
      console.log("글작성성공", response.data);
      navigate('/boardAllview'); //성공시 이동페이지
    }catch(error) {
      console.log("글작성실패", error);
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
      <input type="text" placeholder="제목" value={title} 
      onChange={(e) => setTitle(e.target.value)} 
      className={styles.titleInput} />
      <div className={styles.contentArea}>
        <EditorNomarl ref={editorRef} />
      </div>
    </div>
  );
};
