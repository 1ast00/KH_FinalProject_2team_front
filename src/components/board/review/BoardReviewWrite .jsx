import { useNavigate } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/toastui-editor.css";
import styles from "../../../css/BoardReviewWrite.module.css";

const EditorNomarl = () => {
  return (
    <Editor
      initialValue="Vitalog를 사용하며 좋았던 점을 적어주세요"
      previewStyle="Vertical"
      height="500px"
      initialEditType="wysiwyg"
      useCommandShortcut={false}
      hideModeSwitch={true}
    />
  );
};

export default () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.btn_gap}>
        <button>작성완료-연결전</button>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        
          <EditorNomarl />
        
      </div>
    </div>
  );
};
