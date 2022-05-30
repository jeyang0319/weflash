;(function () {
    'use strict'
    
    let num = 0 //문제 번호

    let mbti_list = ['','','','','','','','','','','','','','','','','','','','']
    
    const q = { //문제들의 객체
        0: {"title": "게임 중 당신이 더욱 성취감을 느낄 때는?", "mbti_type": "SN", "A": "내 전략이 도움이 별로 안됐더라도<br>게임만 이겼음 됐지~", "B": "게임은 졌지만 내 전략이 정말 큰<br>도움이 됐다. 내 말이 맞았지!"},
        1: {"title": "게임 시작 전, 캐릭터를 고를 때<br>당신은?", "mbti_type": "TF", "A": "무조건 강력한 스킬을 가진 캐릭터!", "B": "무엇보다 내가 몰입할 수 있어야지!"},
        2: {"title": "나에게 더 짜릿한 승리는?", "mbti_type": "JP", "A": "상대가 내 예상대로 움직여서 승리.<br>넌 내 손 안에 있다!", "B": "예상치 못한 상대방의 행동에<br>순발력인 대처로 승리. 어림도 없다!"},
        3: {"title": "퇴근 준비 중인 당신에게 친구가<br>같이 게임하자고 한다면?", "mbti_type": "EI", "A": "열심히 일한 만큼 친구랑 게임하면서<br>스트레스 풀어야지!", "B": "열심히 일했으니까 집에서<br>충전해야해.. 거절한다"},
        4: {"title": "당신이 더 선호하는 게임은?", "mbti_type": "SN", "A": "단순 반복 게임", "B": "스토리가 있는 게임"},
        5: {"title": "팀전에서 팀원이 엄청난<br>활약을 했을 때 당신은?", "mbti_type": "TF", "A": "어떻게 한거야? 나도 알려줘!", "B": "역시 넌 우리 팀에 꼭 필요한 존재야<br>최고!"},
        6: {"title": "금요일 밤, 갓생을 위해 다음날<br>7시에 일어나려 했지만 친구에게<br>같이 게임하자는 연락이 왔다", "mbti_type": "JP", "A": "갓생을 위해.. 게임을 포기한다.<br>친구야 미안,,", "B": "뭐.. 하루쯤은 괜찮지 않을까?<br>오케이!"},
        7: {"title": "둘 중 한 게임을 한다면?", "mbti_type": "EI", "A": "친구들과 같이 하는 게임!<br>얘들아 모여~", "B": "게임은 혼자 하는 것도 재밌어..!"},
        8: {"title": "친구가 게임에서 계속 질 때<br>당신의 조언은?", "mbti_type": "SN", "A": "고쳐야 할 점에 대한 디테일한 조언", "B": "고쳐야 할 점의 방향성에 대한 조언"},
        9: {"title": "친구가 게임 룰을 이해하지 못할 때<br>당신은?", "mbti_type": "TF", "A": "논리정연하게 스텝 바이 스텝으로<br>알려준다", "B": "상황에 따라 나누어 설명해준다"},
        10: {"title": "친구가 새로운 캐릭터가 나왔다며<br>추천할 때 당신은?", "mbti_type": "JP", "A": "능력, 콤보 등을 찾아보고<br>좋다고 생각하면 플레이", "B": "친구가 추천해줬으니 일단 플레이"},
        11: {"title": "파티원 중 누군가에게<br>전할 말이 있다면?", "mbti_type": "EI", "A": "전체 채팅방에 바로 보낸다", "B": "파티원에게 개인 채팅으로 보낸다"},
        12: {"title": "당신이 게임 중 상상을 한다면?", "mbti_type": "SN", "A": "만약 내가 게임을 진짜 잘해서<br>프로게이머가 되면 어떡하지?!", "B": "내가 저 게임 속 주인공이었으면..<br>이렇게 했겠지?"},
        13: {"title": "친구가 당신를 위해<br>레어 아이템을 구해왔지만,<br>당신에게 필요가 없다면?", "mbti_type": "TF", "A": "고마워..! (근데 나 이거 필요 없는데..)", "B": "고마워ㅠㅠ! (나를 위해서<br>구해왔다니 감동이야..)"},
        14: {"title": "게임 속 당신의 인벤토리 상태는?", "mbti_type": "JP", "A": "모은 아이템을 찾기 쉽게 정리해둔다", "B": "쌓이는 대로 일단 모아둔다"},
        15: {"title": "음성 채팅으로 진행되는 단체 게임을<br>하다가 어색한 사람과 둘이 남았다", "mbti_type": "EI", "A": "어색하니까.. 내가 먼저<br>말을 걸어볼까?", "B": "아....................."},
        16: {"title": "마피아 같은 추리게임을 할 때<br>당신은?", "mbti_type": "SN", "A": "일단 확실한 정보를 최우선으로<br>하여 추리", "B": "확실한 정보와 더불어 다른<br>가능성도 고려하며 추리"},
        17: {"title": "NPC가 당신이 겨우 달성한<br>업적을 뒤엎고 다시 시작하는<br>퀘스트를 준다면?", "mbti_type": "TF", "A": "귀찮지만 하라는 대로 해야지", "B": "안돼.. 내가 얼마나 고생했는데.."},
        18: {"title": "친구들과 같이 게임하러<br>가기로 한 당신", "mbti_type": "JP", "A": "여기까지 가려면 이렇게 가야하니까<br>이 시간에 출발해야겠다!", "B": "어디서 모이기로 했더라..?"},
        19: {"title": "길드에서 MVP로 선정되어<br>모든 길드원이 열렬한 축하로<br>모든 관심을 당신에게 쏟고 있다.", "mbti_type": "EI", "A": "이 맛에 게임하지~!<br>모두들 감사합니다^^", "B": "기분은 좋은데 이제 축하<br>그만 해줘도 괜찮은데.."},


    }

    const mbti_result = {
        "esfp": {num : 11, "mbti": "(ESFP)", "game" : "캐치마인드", "img" : "../assets/images/mbti_games/1.png", "text" : "대체로 사교적이고 활발한 성격으로 센스가 넘치는 당신! 이러한 당신에게는 '캐치마인드'를 추천해드립니다!<br><br>어떤 상황이던 빠르게 적응하는 당신은 게임 중 예상치 못한 어려운 제시어도 당신의 넘치는 센스를 통해 재치있는 그림으로 표현할 수 있죠!<br><br>또한 은근한 관심 받기를 좋아하기 때문에 자신이 낸 문제에 친구들의 반응이 핫하다면 이것이야말로 게임을 즐기는 이유가 아닐까요? 😉<br><br>혼자 하는 게임보다는 여럿이 친구들과 함께 어울리는 게임을 즐기는 당신에게 '캐치마인드'는 정말이지 찰떡인 게임입니다! ESFP 특유의 낙천적이고 넘치는 에너지로 승부에 상관없이 유쾌하게 게임을 즐겨보아요!<br><br>'캐치마인드'가 하고싶어졌다면 지금 당장 같이 할 친구들을 모아보는 것은 어떨까요?"},
        "istp": {num : 12, "mbti": "(ISTP)", "game" : "세상에서 가장 어려운 게임", "img" : "../assets/images/mbti_games/12.png", "text" : "관찰력이 좋고 한계에 도전하는 것을 좋아하는 당신에게는 '세상에서 가장 어려운 게임'을 추천해드립니다!<br><br>게임 이름에서 알 수 있듯 매우 높은 난이도를 자랑하고 있는 게임입니다. 하지만 관찰력이 좋고 극악의 효율을 추구하는 당신에게 그 정도의 방해 패턴을 파악하는 것은 식은 죽 먹기 아닐까요?<br><br>게임 도중 어려운 방해 패턴이 당신을 괴롭힌다고 하더라도 당신의 끈질긴 도전만 있다면, 그 스테이지를 통과할 수 있는 완벽한 방법을 찾을 수 있을 것이라 생각합니다! 가만히 누워만 있어도 시간이 잘 가는 당신에게 승부욕을 자극하는 '세상에서 가장 어려운 게임'은 정말이지 당신의 시간을 순.삭 시킬 수 있는 게임이 아닐까요?<br><br>이 결과지를 보면서 '세상에서 가장 어려운 게임'이 하고싶어졌다면 지금 당장 시작해봅시다!"},
        "isfp": {num : 15, "mbti": "(ISFP)", "game" : "러브비트", "img" : "../assets/images/mbti_games/15.png", "text" : "섬세하고 예술적인 감각이 있는 당신에게는 '러브비트'를 추천해드립니다!<br><br>여러 노래에 맞추어 방향 버튼과 스페이스바를 눌러야하는 리듬게임에서 당신의 섬세하고 예술적인 감각은 무엇보다도 이 게임을 재미있게 즐길 수 있는 강력한 무기랍니다! <br><br>친구들과 놀고싶지만 막상 나가기에 귀찮을 때, 친구들과 추억의 신나는 노래에 맞춰 게임 속에서 춤추고 즐길 수 있습니다! 와.. 상상만 해도 흥이 나지 않나요?<br><br>하지만 당신이 방장이 되어 노래 선곡을 해야한다면, 당신은 어떤 노래를 선곡할지 고민만 잔뜩 하게 될 수도 있습니다.. 이럴땐 러브비트에서 랜덤 곡을 선택하는 것은 어떨까요? 예상치 못한 곡이 당신의 흥을 끌어낼 수도 있습니다!<br><br>이 결과지를 보면서 '러브비트'가 하고싶어졌다면 지금 당장 시작해보는 것은 어떨까요~!?"},
        "estp": {num : 13, "mbti": "(ESTP)", "game" : "철권", "img" : "../assets/images/mbti_games/13.png", "text" : "에너지가 넘치며 무엇보다 삶을 즐기면서 사는 당신에게는 '철권'을 추천해드립니다!<br><br>자극적인 것을 추구하며 에너지가 넘치는 당신은 누구보다 공격적이고 화끈하게 상대를 제압할 수 있죠!<br><br>승부욕 넘치는 당신이지만, 만약 상대에게 패배하여도 걱정마세요. 뒤끝 없는 화끈한 당신은 바로 '다음 판 고?'라며 겁먹지 않고 저돌적인 모습을 보여줄 것입니다. 그리고 끊임없이 더 강한 상대에게 도전하고 있는 당신을 발견할 수 있을 거예요.<br><br>이것이야 말로 진정 삶을 즐기는 사람이 아닐까요? 자극적인 것을 좋아하고 도전정신이 강한 당신에게 화끈한 '철권'은 정말이지 찰떡인 게임입니다.<br><br>'철권'이 하고싶어졌다면, 지금 당장 친구와 결투해보는 것은 어떨까요~!?"},
        "intj": {num : 10, "mbti": "(INTJ)", "game" : "동물 구출 대작전", "img" : "../assets/images/mbti_games/10.png", "text" : "전략적인 분석과 해결에 뛰어난 당신에게는 '동물 구출 대작전'을 추천해드립니다!<br><br>누구보다 논리적이고 분석적인 당신의 전략만 있다면 동물 친구들을 물에 빠뜨리지 않고 모두 안전하게 구출시키는 것은 식은 죽 먹기 아닐까요? 마지막 목표를 향하는 길이 누구보다 뚜렷하기 때문에 꼼꼼한 계획으로 하나의 체계를 완성할 수 있을 거예요.<br><br>더욱 효율적이기 위해 언제나 새로운 방법을 탐구하는 성격이니까요!<br><br>한편, 완벽주의적인 기질이 있는 당신은 한 마리의 동물이라도 물에 빠진다면 실패했다고 생각할 수도 있습니다. 하지만 걱정마세요. 점점 발전하는 당신의 전략은 꼭 완벽한 성공을 만들어낼 것입니다!<br><br>이 결과지를 보면서 '동물 구출 대작전'이 하고싶어졌다면, 지금 당장 동물 친구들을 구출하러 떠나는 것은 어떨까요~!?"},
        "estj": {num : 14, "mbti": "(ESTJ)", "game" : "루미큐브", "img" : "../assets/images/mbti_games/14.png", "text" : "도전 정신이 강하며 한 번 맡은 일은 끝까지 완수하고자 하는 당신! 이러한 당신에게는 '루미큐브'를 추천해드립니다!<br><br>게임에서 승리하기 위해 체계적이고 정확하게 플레이하는 당신은 루미큐브 숫자 타일이 주어지자마자 승리를 위한 구체적인 전략을 생각하죠!<br><br>하지만 당신의 계획이 다른 플레이어의 숫자 타일에 의해 틀어진다면, 당신은 엄청난 스트레스를 받을 수도 있습니다.<br><br>당신만의 판단력으로 다른 플레이어들이 오히려 당신이 짜놓은 판에 휘둘리게 해보세요! 당신의 우수한 상황 판단 능력만 있다면 루미큐브 1등은 따 놓은 당상, 아닐까요?ㅎㅎ<br><br>이 결과지를 보면서 '루미큐브'가 하고싶어졌다면 지금 당장 게임에 접속해보는 것은 어떨까요~!? 1등을 위하여~!"},
        "infp": {num : 16, "mbti": "(INFP)", "game" : "미스테리 펫", "img" : "../assets/images/mbti_games/16.png", "text" : "친구들과 함께 놀 때도 즐겁지만 혼자 있을 때 비로소 진짜 쉰다고 느끼기는 당신에게 ‘미스테리 펫’ 을 추천해드립니다!<br><br>사람들과 만나며 사용한 에너지를 혼자 힐링하며 채워보는 것이 어떤가요? 밖에선 남에게 맞추어 결정을 내렸다면 게임 할 때 만큼은 내가 원하는 순서로, 원하는 게임을 해보아요!<br><br>당장의 실패와 좌절보다는 그 사람의 가능성을 바라봐주고 목표를 성취할 수 있도록 해주는 당신! 하지만 자기의 실패에는 민감하게 반응 하는 스타일이군요.<br><br>게임할 때 만큼은 자기 자신에게 조금 관대해지는 것은 어떤가요?  미스테리 펫은 무려 10번이나 도전할 수 있는 기회를 준답니다!<br><br>화려한 액션 보다는 예쁜 색감, 디자인을 좋아한다면 미스테리 펫의 귀여운 디자인과 귀여운 미니 게임들을 즐겨보세요! 통통 튀는 노래도 덩달아 당신을 신나게 해줄 거에요!"},
        "infj": {num : 6, "mbti": "(INFJ)", "game" : "젤다의 전설", "img" : "../assets/images/mbti_games/6.png", "text" : "완벽주의 성향과 동시에 상상력과 뛰어난 인내심으로 게임을 처음부터 끝까지 즐길 줄 아는 당신에게 ‘젤다의 전설’을 추천합니다!<br><br>남들은 쉽게 루즈하다고 그만둘 게임이 당신에게는 너무나 즐길 거리가 많은 게임이 됩니다! 오픈월드의 드넓은 맵을 구석구석 다니면서 숨겨진 던전과 에피소드를 찾아봐요!<br><br>당신의 상상력과 직관력을 사용하여 던전의 미로를 탈출하는 재미를 느껴보세요 ㅎㅎ<br><br>점점 강력해지는 몬스터들은 당신의 뛰어난 관찰력을 발휘할 기회입니다! 적의 패턴을 분석하고 당신만의 공략을 만들어보세요! 디테일한 설정들은 항상 당신의 호기심을 자극시키고 신비로운 세계의 빠져들게 만들거에요!<br><br>게임과 잘 어울리는 그래픽과 사운드, 연출은 당신을 한층 더 게임에 매료시키죠. 마지막 던전을 깨기까지 조그만 목표들을 차근차근 달성해봐요!"},
        "enfp": {num : 2, "mbti": "(ENFP)", "game" : "파니룸", "img" : "../assets/images/mbti_games/2.png", "text" : "누구보다 활발하고 자유로운 사고를 소유한 당신! 당신에게는 '파니룸'을 추천해드립니다!<br><br>좋아하는 것에는 애정이 뿜뿜 넘치는 당신은 당신만의 개성 넘치는 미니룸과 아바타 만들기 위해 누구보다 열심히 노력하지 않나요?! 당신의 넘치는 창의력이라면 다른 사람들과는 다른 개성을 표현해낼 수 있을거에요!<br><br>포인트를 모으기 위해 여러 미니게임을 열정적으로 하는 당신의 모습은 정말 멋있답니다.<br><br>하지만 어느 순간에 갑자기 흥미를 잃는다면.. 당장 그만둬버릴 수도 있어요. 이후 또 다른 흥미로운 게임을 찾겠죠~!? 하지만 괜찮아요! 이것 또한 당신의 매력이니까요~~<br><br>오랜만에 당신의 파니룸에 접속하여 나만의 미니룸을 꾸며보는 것은 어떨까요~?"},
        "entj": {num : 3, "mbti": "(ENTJ)", "game" : "불과 물", "img" : "../assets/images/mbti_games/3.png", "text" : "지적인 자극을 좋아하고 논리적으로 분석하는 것을 잘하는 당신! 친구와 함께 머리를 맡대고 스테이지를 깨는 ‘불과 물’ 은 어떠신가요? 아이디어를 내면서 친구와 함께 스테이지를 깨보세요!<br><br>당신의 뛰어난 직관력으로 빠르게 플레이 하다보면 어느새 진두지휘하고 있는 자신을 볼 수 있을거에요! 당신의 뛰어난 통솔력에 친구가 잘 따라줄 순 있지만 반복되다보면 친구는 금세 질릴 지도 몰라요, 가끔은 친구를 위해 조금 천천히 게임을 즐겨보시는건 어떠신가요?<br><br>처음엔 쉬울지 몰라도 점점 어려워지는 난이도에 머리가 아파올 수도 있어요.. 하지만 괜찮아요! 당신의 도전적이고 결단력 있는 모습은 아무리 어려운 난이도의 스테이지도 충분히 깰 수 있을 거랍니다~!?<br><br>머리쓰는 협동게임 ‘불과 물’ 단짝친구와 함께 플레이 해보시는 것은 어떤가요?"},
        "intp": {num : 7, "mbti": "(INTP)", "game" : "지뢰찾기", "img" : "../assets/images/mbti_games/7.png", "text" : "친구와 놀기보다는 혼자 놀기를 좋아하고 분석적으로 문제 해결하기를 좋아하는 당신! 주어진 정보를 통해 또 다른 정보를 찾아내는 지뢰찾기 게임 어떠신가요?<br><br>복잡한 상황에서 엄청난 집중력을 발휘하는 당신에게 지뢰찾기는 조금은 쉽게 느껴질 수도 있어요! 하지만 점점 짧은 시간안에 클리어하는 것을 목표로 하다보면 전혀 만만하게 볼 게임이 아니라는 것을 알거에요!<br><br>자기 자신만의 전략이 생겨나고 시간이 점점 단축되다보면 어느새 광클하고 있는 나 자신을 볼 수 있을거에요!<br><br>때론 주어진 정보만으론 답이 나오지 않아 운에 맡겨야 하는 상황도 있을거에요!<br><br>하지만 인생이란게 항상 논리적으로 돌아가는 세상은 아니니까요 ㅎㅎ 때론 운에게 맡기고 그냥 즐기는 건 어떨까요? 게임이잖아요~~!"},
        "esfj": {num : 5, "mbti": "(ESFJ)", "game" : "동물농장", "img" : "../assets/images/mbti_games/5.png", "text" : "활발한 성격을 가진 당신, 언제나 주위에 사람이 모이는군요? 주위 사람들에게 관심이 많은 당신에게는 여러 사람들을 행복하게 해줄 수 있는 ‘동물농장’ 게임이 딱 어울리네요!<br><br>타인을 헤아릴 줄 아는 당신은 본인의 농장뿐만 아니라, 주변 친구들의 농장에도 항상 관심을 가져요. 동물병원 입원실에 친구의 동물이 입원해 있다면 주저없이 위로의 선물을 보내줄 당신!<br><br>꽤나 철저한 계획을 세우기 때문에 농장을 꾸밀 때에도 동물과 훈장, 아이템을 어떻게 배치할지 항상 염두에 두고 꾸미진 않으신가요?<br><br>각 동물마다 다르게 주어진 퀘스트를 완료할 때, 당신은 한 동물에 치우치지 않고 여러 동물을 골고루 성장시킬 것 같아요.<br><br>퀘스트 도중 갑작스럽게 친구가 불러도 계획이 틀어졌다는 것에 꺼려하긴 하지만, 막상 잘 가고 즐거워하는 거 다 알고 있답니다!"},
        "enfj": {num : 1, "mbti": "(ENFJ)", "game" : "동물의 숲", "img" : "../assets/images/mbti_games/1.png", "text" : "경쟁적이기 보다는 더 좋은 공동체를 꾸려가는데 관심이 많은 당신에게는 ‘동물의 숲’을 추천합니다!<br><br>아무것도 없는 섬에서 부터 자신만의 섬을 꾸미는 일은 책임감이 강하고 계획적인 당신에게 딱 일 것 같은데요?! 섬의 곳곳에 카페부터 시작해서 온천, 오락실까지 조금씩 조금씩 완성해 보아요! 미래지향적인 당신에게는 아무것도 없는 섬의 모습도 전혀 문제 될게 없을 거에요!<br><br>혼자 하면 조금 심심할 수도 있으니 친구들을 섬의 주민으로 초대해 같이 살고 꾸미는 것은 어떤가요?! 그렇게 정성스럽게 꾸민 섬들을 나중에 sns에 자랑할 수 도 있겠죠? <br><br>당신은 누군가를 위해 한달음에 달려갈 수 있는 사람이에요. 주민들끼리 의견이 안맞는다면 의견을 조율하며 때론 당신의 의견도 내려놓을 줄 아는 사람이죠.<br><br>하지만 선넘는 행동들은 금지! 자신에게도 남에게도 적용되는 규칙이에요! 다른 사람의 장점을 잘 찾아내는 당신 덕분에 섬은 더 행복할 수 있을거예요!<br><br>지금 당장 닌텐도 스위치를 들고 모든 주민들이 만족하고 행복할 수 있는 섬을 만들어 볼까요?"},
        "entp": {num : 4, "mbti": "(ENTP)", "game" : "마피아게임", "img" : "../assets/images/mbti_games/4.png", "text" : "뜨거운 논쟁을 즐기는 당신!! 시민들 속에 숨어있는 마피아를 찾거나 마피아가 되어서 시민들을 말로 현혹시켜 시민들을 다 죽음으로 모는 게임 ‘마피아’는 어떠신가요?<br><br>당신은 사람들의 행동의 변화를 지켜보고 말과 말 사이에 있는 오류들을 찾아내면서 마피아 게임을 토론대회로 만들어 버리는 능력이 있군요! 그리고 토론에서는 절대 지지 않죠. 빠른 두뇌회전을 이용해서 불리한 상황을 뒤집을 아이디어를 떠올릴 줄 안답니다.<br><br>또한 그런 아이디어를 상대방에게 설득시킬 뛰어난 언변도 가지고 있죠! 당신의 타고난 자신감은 상대방이 더욱 쉽게 당신의 주장에 매료되게 할 거에요. 그런 설득력으로 상대방을 교란시키고 헷갈리게 하면서 게임의 흐름을 당신의 것으로 가져오신다면 게임의 재미를 더욱 느끼실 수 있을거에요!<br><br>때론 당신의 판단이 틀릴 수도 있어요! 그러니 가끔씩은 다른 사람의 의견을 귀담아 듣고 생각 해보는 것이 어떤가요?어디든 토론의 장으로, 연설의 장으로 만들 당신!어디서든 마피아 게임으로 당신의 언변을 뽐내보세요!"},
        "istj": {num : 9, "mbti": "(ISTJ)", "game" : "스도쿠", "img" : "../assets/images/mbti_games/9.png", "text" : "무슨 일이든 정확하게 하고 신중하게 일을 처리하는 당신에게는 ‘스도쿠’를 추천해드리고 싶어요!<br><br>명확한 규칙이 있는 스도쿠에서 숫자를 잘못 세거나 잘못 적으면 잘못을 바로 잡을 수도 없이 뒤죽 박죽이 되기 쉬우니 조심해야해요.<br><br>하지만 당신에게는 절대 실수란 용납할 수 없죠! 가끔 명확한 답이 나오지 않아 몇가지 경우의 수를 시도해 보아야 할 때도 있어요! 숲보다는 나무 보는 능력이 뛰어난 당신에게 다른 칸들을 생각 하면서 경우의 수를 시도하는 것이 쉬운 일만은 아닐거에요..<br><br>하지만 당신은 포기하지 않죠! 조금 늦어지더라도 숲을 보려고 노력하고 신중히 당신 앞에 주어진 문제들을 해결하다 보면 어느샌가 문제를 해결한 당신을 볼 수 있을거에요!<br><br>반복적인 일도 질리지 않고 할 수 있는 당신은 하루종일 혼자 스도쿠를 하더라도 거뜬히 해낼 수 있을거에요!"},
        "isfj": {num : 8, "mbti": "(ISFJ)", "game" : "다마고치", "img" : "../assets/images/mbti_games/8.png", "text" : "가까운 사람에게는 한없이 헌신적이고 애정이 넘치는 당신에게는 추억의 ‘다마고치’를 추천합니다가벼운 관계를 싫어하고 깊은 관계를 선호하는 당신에게 다마고치는 당신만의 애완동물이 될거예요.<br><br>게임 속 애완동물이지만 보살펴 주지 않는다면 죽음에 이르기도 한답니다. 물론 타인의 변화에 민감한 당신이 그렇게 방치 하는 일은 없을거에요!<br><br>섬세한 당신은 다마고치의 상황에 언제나 민감하게 반응 해줄 거에요. 밥을 먹이고 배설물을 치우며 애정까지 꾸준히 줘야하는 다마고치! 다마고치는 당신이 어떻게 키우냐에 따라 다양한 모습으로 자라난답니다.<br><br>자신의 바운더리 안에 있는 사람에겐 언제나 진심인 당신과 함께라면 절대 아프지 않고 끝까지 자랄 수 있을 것 같아요.<br><br>집순이인 당신에게 다마고치는 너무나도 귀여운 애완동물이 되어줄 것 이랍니다! 본인의 따듯한 마음을 나만의 애완동물 다마고치와 나누어 보는 것은 어떤가요?"}
    }

    const get = (target) => {
        return document.querySelector(target)
    }

    const question = get('.question')
    const answer1_text = get('.answer1_text')
    const answer2_text = get('.answer2_text')
    const answer1 = get('.answer1')
    const answer2 = get('.answer2')
    const $nextBtn = get('.next_button')
    const $prevBtn = get('.prev_button')
    const $questionPage = get('.question_page')
    const $resultPage = get('.test_result')
    const $answer1 = get('.answer1')
    const $answer2 = get('.answer2')
    
       //결과 페이지
    const $roading = get('.roading')
    const result_game = get('.test_result_gamename')
    const result_mbti = get('.test_result_mbti')
    const result_txt = get('.test_result_text')

    const $tetris = get('.tetris')


    let mbti_value = "N"


    const test = () => {
        question.innerHTML = q[num]["title"]
        answer1_text.innerHTML = q[num]["A"]
        answer2_text.innerHTML = q[num]["B"]
    }

    const clickA = () => {
        if (num == 0) {
            $nextBtn.disabled = false
        } else {
            $prevBtn.disabled = false
            $nextBtn.disabled = false
        }

        if (q[num]["mbti_type"] == "SN") {
            mbti_value = "S"
        } else if (q[num]["mbti_type"] == "TF") {
            mbti_value = "T"
        } else if (q[num]["mbti_type"] == "JP") {
            mbti_value = "J"
        } else if (q[num]["mbti_type"] == "EI") {
            mbti_value = "E"
        }

        
        if ($answer2.classList["value"] == "answer2 click") {
            $answer2.classList.toggle('click')
            $answer1.classList.toggle('click')
        } else if ($answer1.classList["value"] == "answer1") {
            $answer1.classList.toggle('click')
        }
    }


    const clickB = () => {
        if (num == 0) {
            $nextBtn.disabled = false
        } else {
            $prevBtn.disabled = false
            $nextBtn.disabled = false
        }
        
        if (q[num]["mbti_type"] == "SN") {
            mbti_value = "N"
        } else if (q[num]["mbti_type"] == "TF") {
            mbti_value = "F"
        } else if (q[num]["mbti_type"] == "JP") {
            mbti_value = "P"
        } else if (q[num]["mbti_type"] == "EI") {
            mbti_value = "I"
        }

        
        if ($answer1.classList["value"] == "answer1 click") {
            $answer1.classList.toggle('click')
            $answer2.classList.toggle('click')
        } else if ($answer2.classList["value"] == "answer2") {
            $answer2.classList.toggle('click')
        }
        
    }

    function getCount(mbti_list) {
        return mbti_list.reduce((pv, cv) => {
            pv[cv] = (pv[cv] || 0) + 1;
            return pv;
        }, {});
    }

let mbti = "";
    const cal = () => {
        const cal_value = getCount(mbti_list)
        const s_count = parseInt(cal_value["S"]);
        const t_count = parseInt(cal_value["T"]);
        const j_count = parseInt(cal_value["J"]);
        const e_count = parseInt(cal_value["E"]);
        
        
        (e_count > 2) ? mbti += "e" : mbti += "i";
        (s_count > 2) ? mbti += "s" : mbti += "n";
        (t_count > 2) ? mbti += "t" : mbti += "f";
        (j_count > 2) ? mbti += "j" : mbti += "p";
        
        result_mbti.innerHTML = mbti_result[mbti]["mbti"]
        result_game.innerHTML = mbti_result[mbti]["game"]
        result_txt.innerHTML = mbti_result[mbti]["text"]
        let img = mbti_result[mbti]["img"]
        document.getElementById('mbti_img').setAttribute('src', img)

    }

    const result_show = () => {
        $resultPage.classList.toggle('show')
        $roading.classList.toggle('none')
    }

    const buildTetris = () => {
        // 테트리스 블록 추가하기
        for (let i = 20; i >= 1; i--) {
            const tetrisBlock = document.createElement('img')
            tetrisBlock.src = `../assets/images/tetris/${i}.png`
            tetrisBlock.className = `tetris_block_${i} none`
            $tetris.appendChild(tetrisBlock)
        }
    }
    
    const tetrisFall = () => {
        const $tetrisBlock = get(`.tetris_block_${num}`)
        $tetrisBlock.style.marginButtom = 80 + 'px'
        $tetrisBlock.classList.toggle('none')
    }

    const tetrisUndo = () => {
        const $tetrisBlock = get(`.tetris_block_${num+1}`)
        $tetrisBlock.classList.toggle('none')
    }

    const tetrisLast = () => {
        const $tetrisBlock = get('.tetris_block_20')
        $tetrisBlock.classList.toggle('none')
    }

    const init = () => {
        buildTetris()

        answer1.addEventListener('click', () => {
            clickA()
        })

        answer2.addEventListener('click', () => {
            clickB()
        })

        $nextBtn.addEventListener('click', () => {
            $prevBtn.disabled = false
            mbti_list[num] = mbti_value
            
            if ($answer1.classList["value"] == "answer1 click") {
                $answer1.classList.toggle('click')
            }
            if ($answer2.classList["value"] == "answer2 click") {
                $answer2.classList.toggle('click')
            }
            
            if (num == 0) {
                tetrisLast()
                cal()
                $questionPage.classList.toggle('show')
                $roading.classList.toggle('none')
                $nextBtn.disabled = true
                setTimeout(result_show, 3000)
                $tetris.style.display = "none"

                console.log(mbti_result.findIndex(i => i.num == 0))
            } else {
                num++
                test()
                
                $nextBtn.disabled = true
            }

            tetrisFall()
        })

        $prevBtn.addEventListener('click', () => {
            if ($answer1.classList["value"] == "answer1 click") {
                $answer1.classList.toggle('click')
            }
            if ($answer2.classList["value"] == "answer2 click") {
                $answer2.classList.toggle('click')
            }
            num--
            test()
            if (num == 0) {
                $prevBtn.disabled = true
                $nextBtn.disabled = true
            } else {
                $nextBtn.disabled = true
            }

            tetrisUndo()
        })
        
    }
    init()
  })()
  
