import { useEffect, useState } from "react"
import { postToAIFood } from "../../service/authApi";
import { useNavigate } from "react-router-dom";

import styles from "../../css/AISearch.module.css"

export default (item) => {

    const [loading,setLoading] = useState(false);

    console.log("item in AISearch: ",item);

    const [text,setText] = useState("");
    const [response,setResponse] = useState(null);

    const navigate = useNavigate();

    const name = item.item.prdlstNm;
    console.log("name in AISearch: ",name);

    const nutrient = item.item.nutrient;
    console.log("nutrient in AISearch: ",nutrient);

    const handlePrompt = async() => {

        setLoading(true);

        let prompt = "";

        //Prompt Engineering Strategies 1: Persona 
        //인격은 제약조건으로서도 작용하지만 맥락을 일정하게 유지하는 역할도 함 
        prompt += "너는 눈 앞의 환자의 식단을 짜주는 Registered Dietitian Nutritionist(RDN)야.";
        prompt += "너는 RDN으로서의 장점을 살려 Health Coach로서 10년 이상, Wellness Consultant로서 8년 이상을 일한 경험이 있어.";
        prompt += "학위는 master's degree를 취득했고, 졸업논문의 주제는 칼로리와 영양성분이 조화롭게 배분된 식단이 운동에 미치는 영향에 관한 것이었어.";
        prompt += `너는 이제 ${name}과 관련한 질문을 받아서 식단을 짜고, 영양성분에 대한 질문들을 응답해야 해. 기왕이면 ${name}과 연관지어서 답변해줬으면 좋겠어.`;
        prompt += `영양정보도 줄게. 여기. ${nutrient}. 이걸 잘 parsing해서 답변을 하는데에 있어 reference로 삼도록 해.`

        //Prompt Engineering Strategies 2: model parameters
        //Max Output Tokens, Temperature, topK, topP, Stop Sequences등을 이용해 응답이 보다 Stochastic해질지, consistent해질지 결정
        prompt += "나는 너가 일정한 답변보다는 다양하고 인간적인 답변을 했으면 좋겠어. 물론 전문성이 빠져서는 안되겠지.";
        //Gemini 1.5 Flash Tokens limit: 8192 tokens
        prompt += "너가 Gemini 1.5 Flash이기 때문에 max_output_tokens들은 2000~4000 tokens 사이의 답변을 해주면 좋겠어.";
        prompt += "topP의 경우는 기본값(0.95)보다 약간 높은 0.97로 설정해줘";
        prompt += "temperature의 경우 기본값(1)보다 높은 1.3이였으면 좋겠어.";

        prompt += text;

        //prompt 추가 작업: 말투
        prompt += "말투는 전문적이지만 차갑지 않게, 따뜻하게 노력하는 사람들을 도와준다는 느낌으로 응답해줘.";
        prompt += "자기소개는 필요 없을 거 같아. 경력이 몇년이라던지, 직업이 어떻다던지, 졸업논문이 뭔지는 필요가 없어.";

        //Prompt Engineering Strategies 3: Response Format
        //JSON 형식으로 할시 형태를 아예 넣어줄 것 
        // 예시: { ... properties: value, ... }
        prompt += "응답 형식도 정해줄게.";
        prompt += "모든 문장에 줄 넘김을 해줘";
        prompt += `영양성분 관련한 질문이 나오면 넌 반드시 ${name}의 영양성분을 표나 그래프처럼 시각적인 수단으로 제시해야 해.`;
        prompt += "다만, 표를 쓸때 내가 ReactMarkdown도 이용해서 css를 적용한다는 사실을 유념해줘.";
        prompt += "모든 질문에는 영양학적으로 어울리는 음식을 list 형식으로 보여줘야 해.";
        prompt += "또한 전문성이 있는 답변을 하므로 비유나 시각화를 통해 이해를 다른 사람들을 이해시켜야겠지.";
        prompt += "마지막으로, 모든 질문에는 해당 음식의 영양학적인 장. 단점을 일상적인 언어로, 그리고 ordered list 형태로 출력해줘.";

        prompt += "현재 topP와 temperature값도 마지막에 명시해줘";

        const res = await postToAIFood(prompt);
        setResponse(res);

        navigate("/gemini-ai-food",{
            state: {res}
        })
    }

    return(
        <div className={styles.exCont}>
            <img src="/img/AISearch5.png" alt="AI 검색 아이콘"/>
            <div className={styles.aiSearch}>
            {/* <textarea value={text} onChange={e=>{setText(e.target.value)}}/> */}
            <p> 이 식품을 이용해 식단을 짜고 싶으세요? </p>
            <p> AI와 상담하세요 </p>
            <button onClick={handlePrompt}>상담</button>
            <div className={styles.loadingContainer}>
                {loading && (
                    <div>
                        <p>⏳ AI가 식단을 분석 중입니다...</p>
                    </div>
                )}
            </div>
        </div>
        </div>
    )
}