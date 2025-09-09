import React, { forwardRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/toastui-editor.css";

const EditorNomarl = forwardRef((props, ref) => {
  return (
    <Editor
      ref={ref}
      initialValue="Vitalog를 사용하며 좋았던 점을 적어주세요"
      previewStyle="Editer"
      height="500px"
      initialEditType="wysiwyg"
      useCommandShortcut={false}
      hideModeSwitch={true}
      // 토스트 UI 이미지 업로드 훅은 여기에 구현
      hooks={
        {
          // addImageBlobHook: ...
        }
      }
    />
  );
});

export default EditorNomarl;

