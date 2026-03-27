// ===== 纸扎铺 - 对话数据 =====
// 注意：直接挂载到 window 以供全局访问

window.DIALOGS = {

  ch1_train: [
    { speaker: '', text: '高铁在傍晚驶入醴陵境内，窗外的天色已经压得很低。一排排水杉从视野里掠过，叶子是那种沉闷的暗绿，像是被什么东西捂死了颜色。' },
    { speaker: '陈安（内心）', text: '奶奶从来不生病。她能在院子里扛起一袋五十斤的稻谷，能在三伏天里不喝水劳作半天。然后……突发心疾，安详离世。', sanity: -0 },
    { speaker: '陈安（内心）', text: '安详。我默念这个词，舌根发苦。' },
    { speaker: '叔父（电话）', text: '你回来一趟吧，有些东西得你来处理。……纸扎的事。', portrait: null },
    { speaker: '陈安（内心）', text: '纸扎的事。这四个字让我想起童年时的一个傍晚——那年七岁，跟着奶奶去张记纸扎铺……' },
    { speaker: '奶奶（记忆）', text: '开了光的东西，你就当没看见。' },
  ],

  ch1_town: [
    { speaker: '', text: '清溪镇。这名字骗了许多外地人，以为是山清水秀之地。其实清溪的溪早已干了十几年，只剩一条浅浅的泥沟。' },
    { speaker: '陈安（内心）', text: '路灯是旧式的黄钨灯，光圈昏黄模糊，把地面照出一种溺水前的颜色。叔父没来接我。' },
  ],

  ch1_flowers: [
    { speaker: '陈安（内心）', text: '奇怪……这短短一段路上，竟有七个花圈，挂在七户人家门口。', sanity: -5 },
    { speaker: '陈安（内心）', text: '中元节还有三天，花圈是正常的，但……七个，连续七户。我在心里划了一条线——这条线通向某个还不知道的答案。' },
  ],

  ch1_yard: [
    { speaker: '', text: '老宅的大门开着。院子里的气味扑面而来——香灰、旧木、还有一种说不清楚的甜腻，像是什么东西在腐烂前散发出的最后气息。' },
    { speaker: '陈安（内心）', text: '堂屋里点着灵烛，奶奶的遗像摆在正中，黑白照片里的她表情严肃，一如生前。' },
  ],

  ch1_meet_zhangyi: [
    { speaker: '张意', text: '你来了。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '你是……', portrait: 'chengan' },
    { speaker: '张意', text: '我是张意。张老头是我爷爷。陈奶奶去世前几个月，一直是我在帮着照应。你叔父……不大方便。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '不大方便是什么意思？', portrait: 'chengan' },
    { speaker: '张意', text: '你叔父这几个月精神一直不太好，你明天见到他就知道了。', portrait: 'zhangyi' },
    { speaker: '陈安（内心）', text: '她转身去拨弄灵烛，细白的手指捏住烛剪，动作利落。烛火跳了一下——她颈后，竹簪下方，有一个很小的符文，朱砂所写，只有铜钱大小。', flag: 'found_seal' },
    { speaker: '陈安（内心）', text: '我以为我看错了。' },
  ],

  ch1_night_shadow: [
    { speaker: '', text: '老屋的木床很旧，被子有一股阳光和艾草的气味。陈安把脸埋进去，想起小时候常常钻进这被子里躲猫猫——', sanity: -0 },
    { speaker: '', text: '梦里只有一扇门。红漆的，门缝里透着红色的光，不像灯，像是里面有什么东西在烧。门上有字，是刻的——' },
    { speaker: '', text: '门轰然洞开了。里面是一片白。白得没有边际，白得像一张铺开的宣纸。那片宣纸上，有一个人影，蜷缩着……', sanity: -5 },
    { speaker: '', text: '那个人影抬起头。是奶奶的脸。但那张脸是纸做的。', sanity: -10 },
    { speaker: '陈安（内心）', text: '惊叫着坐起来，汗把睡衣浸透了。窗外深夜，月光冷白照进来，照在门缝里——' },
    { speaker: '', text: '门缝里有一条阴影。细长的，不动的。像是有人贴着门站在外面。', sanity: -15, flag: 'first_night_shadow', sfx: 'paper' },
    { speaker: '陈安（内心）', text: '我盯着那条阴影看了很久很久，直到月亮转过去，光消失，阴影也跟着消失。整个夜晚没有风，但有纸张被吹动的声音。' },
  ],

  ch1_paperdoll: [
    { speaker: '', text: '第二天一早，院子里发现了一个纸人——放在水缸旁边，就那么站着，像是趁夜放进来的。', sanity: -10, sfx: 'paper' },
    { speaker: '陈安（内心）', text: '诡异的是，这个纸人穿的衣服，和奶奶遗像里的那件一模一样。纸人手里夹着一张小纸条……' },
    { speaker: '奶奶的字条', text: '「安儿，莫要进那铺子。」', item: ['note', '奶奶的字条'] },
    { speaker: '陈安（内心）', text: '我握着那张纸条站起来，背后有什么东西凉凉地爬上了脊梁。远处，张记纸扎铺的招牌隐约可见，红灯笼在无风的清晨里，轻轻地摇。' },
  ],

  ch2_uncle: [
    { speaker: '', text: '陈安找到叔父的时候，他正坐在堂屋角落里叠纸。不是叠元宝，是叠人。' },
    { speaker: '陈安（内心）', text: '一个一个的纸人，叠好了就摆在地板上，已经有七八个了，排列得整齐到令人不安。', sanity: -5 },
    { speaker: '陈安', text: '叔父。', portrait: 'chengan' },
    { speaker: '叔父陈国生', text: '安儿。你来了。', portrait: null },
    { speaker: '陈安', text: '你怎么了？', portrait: 'chengan' },
    { speaker: '叔父陈国生', text: '没事。睡不好，就叠叠纸，心里踏实些。' },
    { speaker: '陈安', text: '院子里出现了一个纸人，是你放的吗？', portrait: 'chengan' },
    { speaker: '叔父陈国生', text: '不是我，是张老头。' },
    { speaker: '陈安', text: '为什么他要在院子里放纸人？', portrait: 'chengan' },
    { speaker: '叔父陈国生', text: '……安儿，你奶奶死得不对。' },
    { speaker: '陈安', text: '你说什么？', portrait: 'chengan' },
    { speaker: '叔父陈国生', text: '她死之前，来找过我。她说她看见了东西。夜里，院子里，有纸人在走。不是摆着的，是……走着的。' },
    { speaker: '陈安（内心）', text: '空气突然变凉了几度。', sanity: -5 },
    { speaker: '叔父陈国生', text: '然后我说她老糊涂了，让她别多想。然后过了三天，她死了。' },
    { speaker: '叔父陈国生', text: '张老头知道些什么。你去找他，但你要小心。那个铺子……夜里不要进去。' },
    { speaker: '陈安', text: '为什么？', portrait: 'chengan' },
    { speaker: '叔父陈国生', text: '因为夜里那里头的东西会醒着。' },
  ],

  ch2_shop_enter: [
    { speaker: '', text: '张记纸扎铺，大白天。陈安告诉自己，大白天没什么好怕的。' },
    { speaker: '', text: '铺子里的陈设和记忆里没有本质的区别，只是更旧、更满。香灰、糊浆、还有一种说不清楚的陈旧，像是时间的尸体泡在这个空间里慢慢发酵。', sfx: 'paper' },
    { speaker: '张老头', text: '进来吧，陈安。', portrait: 'zhanglaotou' },
    { speaker: '陈安（内心）', text: '他没有转头——怎么知道是我？走进去，绕到正面，低头去看他手里那个纸人……体型、身高，和我一模一样，脸还是白茫茫的。' },
    { speaker: '陈安', text: '这是……', portrait: 'chengan' },
    { speaker: '张老头', text: '练手的。坐。', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '我奶奶是怎么死的？', portrait: 'chengan' },
    { speaker: '张老头', text: '心疾。', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '您和我叔父说的不一样。', portrait: 'chengan' },
    { speaker: '张老头', text: '你叔父说什么了？', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '他说她死前看见院子里有会走路的纸人。', portrait: 'chengan' },
    { speaker: '张老头', text: '那不是幻觉。', portrait: 'zhanglaotou' },
    { speaker: '陈安（内心）', text: '这四个字把我钉在了椅子上。', sanity: -5 },
    { speaker: '陈安', text: '您的意思是，纸人真的会走？', portrait: 'chengan' },
    { speaker: '张老头', text: '不是所有的。只有开了光的。', portrait: 'zhanglaotou' },
    { speaker: '陈安（内心）', text: '那个词——开了光。奶奶说的话从记忆深处浮上来：「开了光的东西，你就当没看见。」' },
    { speaker: '陈安', text: '谁给它们开的光？', portrait: 'chengan' },
  ],

  ch2_shop_coin: [
    { speaker: '陈安', text: '张爷爷，奶奶留字条让我不要来这铺子，但字条是用纸人传的——说明她不怕纸人，是在借纸人给我传话。这说明……她和您有约定。', portrait: 'chengan' },
    { speaker: '张老头', text: '你比我预料的聪明些。', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '告诉我真相。', portrait: 'chengan' },
    { speaker: '张老头', text: '不是现在。', portrait: 'zhanglaotou' },
    { speaker: '陈安（内心）', text: '他站起来，走到货架旁边，从抽屉里取出一个用黑布包着的东西，递给我……里面是一枚铜钱，穿着红线，正面年号模糊，背面刻着一个字：渡。', item: ['coin', '铜钱（渡）'], sfx: 'coin' },
    { speaker: '张老头', text: '今晚你会做梦，梦里有一盏灯，你把这个挂在灯上，你就能出来。', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '这是什么？', portrait: 'chengan' },
    { speaker: '张老头', text: '救命的东西。走吧，天黑之前离开这里。', portrait: 'zhanglaotou' },
  ],

  ch2_meet_zhangyi2: [
    { speaker: '', text: '离开铺子时，在门口遇见了张意。她换了件衣服，还是素净的颜色，手里捧着一盏小灯笼，里面点着细蜡烛。' },
    { speaker: '张意', text: '出来了？', portrait: 'zhangyi' },
    { speaker: '陈安', text: '出来了。你也住在铺子附近？', portrait: 'chengan' },
    { speaker: '张意', text: '我住在铺子后面，陪我爷爷。', portrait: 'zhangyi' },
    { speaker: '张意', text: '陈安。昨晚那个纸人……是我放的。字条是陈奶奶生前给我的，她说，如果她先走了，就让我想办法传给你。我只是在完成她的托付。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '谢谢。', portrait: 'chengan' },
    { speaker: '陈安（内心）', text: '她的眼神很平静，但那平静的后面有什么东西在流动，深的，不该在这种场合出现的东西。' },
    { speaker: '', text: '那天夜里，陈安果然做梦了。而这一次，梦里出现的不是奶奶，是一整个世界。' },
  ],

  ch2_dream: [
    { speaker: '', text: '梦境是一条街道，但不是清溪镇的街道。街道两边是纸做的建筑，全部白色，但白色里透着光，像是有火在里面燃烧，把纸照成了半透明的琥珀色。' },
    { speaker: '陈安（内心）', text: '街道上有纸人，但这些纸人有动作，有节奏，有某种精确的、类似生命的东西在驱动着它们。', sanity: -5 },
    { speaker: '陈安（内心）', text: '我站在街道中央，知道自己在做梦，却走不动。然后我看见了那盏灯——就像张老头说的，一盏灯，挂在一根木杆上，在风里摇。' },
    { speaker: '陈安（内心）', text: '灯笼是红色的，破旧的，火苗在里面跳。我握着铜钱，走过去……' },
  ],

  ch2_dream_solved: [
    { speaker: '', text: '铜钱触到灯笼穗子的瞬间，整个梦境轰然震动——', sfx: 'coin' },
    { speaker: '', text: '那些纸人同时停下来，同时转过头，同时看向陈安——一百张白色的脸，一百双黑色的眼睛。', sanity: -10 },
    { speaker: '', text: '一个纸人从人群里走出来，缓缓地，走向陈安……那张脸是真实的，不是纸。' },
    { speaker: '奶奶', text: '安儿，你找到了对的人。但那个铺子里有个秘密，是张家欠我们陈家的债。你爷爷……你爷爷没有死透。', hope: 20, flag: 'grandpa_not_dead' },
    { speaker: '陈安', text: '奶奶，爷爷在哪里——', portrait: 'chengan' },
    { speaker: '', text: '梦醒了。窗外，鸡叫了第一声。手心里那枚铜钱烫得像刚从火里取出来。', sanity: -5, sfx: 'coin' },
    { speaker: '陈安（内心）', text: '「你爷爷没有死透」——这句话在空荡荡的老屋里回响，撞在墙壁上，撞进骨髓里。' },
  ],

  ch3_attic_enter: [
    { speaker: '', text: '老宅阁楼，低矮，只有一扇小窗透光。满地灰尘，若干旧木箱落满了蛛网。' },
    { speaker: '陈安（内心）', text: '那个最旧的木箱，在最深处……' },
  ],

  ch3_attic_done: [
    { speaker: '陈安（内心）', text: '照片里那双眼睛——那是我自己的眼睛，一模一样的眼睛。陈志明，1967年，清溪。', hope: 10, flag: 'found_photo' },
    { speaker: '陈安（内心）', text: '残信辨认出几个词——「张记」、「契约」、「三代」。拼图开始拼出形状了，但形状让我不寒而栗。' },
    { speaker: '陈安（内心）', text: '归魂钥匙。拿着这把钥匙，我去找了张意——不是张老头，而是张意。不知为何，我觉得她说的是真话。' },
  ],

  ch3_zhangyi_secret: [
    { speaker: '张意', text: '坐下，我跟你说。这要从六十年前说起。', portrait: 'zhangyi' },
    { speaker: '张意', text: '你爷爷陈志明，和我曾祖父张德昌，是结拜兄弟。', portrait: 'zhangyi' },
    { speaker: '张意', text: '那时候镇上来了一个煞——不是比喻，就是那种老人说的、能害人的东西。连续三年，镇子里死了十几个人，没有病因，人就这样没了。', portrait: 'zhangyi' },
    { speaker: '张意', text: '我曾祖父懂些民俗，知道怎么压——但代价是，要用人的魂魄来锁。不是死人的魂魄，是活人的一缕魂。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '……', portrait: 'chengan' },
    { speaker: '张意', text: '你爷爷自愿的。他说他是结拜兄哥，这种事他来。他让出了自己的一缕魂，被封进了一个纸扎的宅子里——就是我曾祖父亲手做的那个阴宅。', portrait: 'zhangyi' },
    { speaker: '张意', text: '然后……他用剩下的魂撑着活了大概三年，就走了。走得不完整，那一缕魂还在里面。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '那把钥匙——能开那个纸宅的锁。', portrait: 'chengan' },
    { speaker: '张意', text: '对。钥匙原本在你奶奶手里。她临终前藏了起来，留给你。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '那个纸宅在哪里？', portrait: 'chengan' },
    { speaker: '张意', text: '陈安，那个纸宅里的东西，不只是你爷爷的魂。还有那个煞——它一直在里面，等着出来。如果你打开那把锁，它会跟着你爷爷一起出来。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '……我想见我爷爷。', portrait: 'chengan' },
  ],

  ch3_basement: [
    { speaker: '', text: '张记纸扎铺地下室，深夜。低矮空间，石砖地面，潮湿发凉。砖缝里透着幽蓝的磷光，不像火，更像是荧光菌，幽微而持续。', sfx: 'paper' },
    { speaker: '陈安（内心）', text: '张意给的线索：数第七块砖，右移三格，按下去。' },
    { speaker: '陈安（内心）', text: '只有灯笼的光圈照着……砖墙前，我数了一遍又一遍。' },
  ],

  ch3_darkroom_enter: [
    { speaker: '', text: '机关古老而精准。砖墙的一角转开，露出一道窄门。', sfx: 'unlock' },
    { speaker: '', text: '暗室不大，但里面的东西让人喉咙发紧——满屋子的纸宅，大大小小，摞得很高，每一个贴着名字和年份。', sanity: -5 },
    { speaker: '陈安（内心）', text: '最新的纸宅，黄纸上的日期是三个月前——陈桂英。奶奶的名字。' },
    { speaker: '陈安（内心）', text: '不是封存，是……登记。有人在给那个煞喂魂。', sanity: -20, flag: 'found_feihun' },
    { speaker: '陈安（内心）', text: '那个最旧的纸宅，比别的都要精细，门窗俱全，甚至有雕花……黄纸上写着：陈志明，一九七一年。' },
  ],

  ch3_open_lock: [
    { speaker: '陈安', text: '（将归魂钥匙插入莲花铜锁）', portrait: 'chengan', sfx: 'unlock' },
    { speaker: '', text: '钥匙入锁的瞬间，暗室温度骤降，呼出来的气变成白雾。灯笼里的火苗几乎熄灭，然后重新燃起——但光的颜色变了，从暖黄变成了冷蓝。' },
    { speaker: '', text: '纸宅的门，自己开了。里面什么都没有，只有黑暗。但那黑暗是会呼吸的。', sanity: -10 },
    { speaker: '陈安', text: '爷爷。是我，陈安。奶奶让我来的。', portrait: 'chengan' },
    { speaker: '', text: '黑暗里什么都没有发生……他等了很久，久到以为什么都不会发生了——' },
    { speaker: '爷爷陈志明', text: '……出去，快跑。', portrait: 'grandpa', hope: 10, flag: 'grandpa_appeared' },
    { speaker: '', text: '暗室的墙壁开始颤抖。那些摞得很高的纸宅开始摇晃，黄纸如雪飘落。那种沙沙声——不是轻微的，是巨大的，像一千张纸同时被揉皱。', sanity: -10, sfx: 'paper', flag: 'sha_escaped' },
    { speaker: '陈安（内心）', text: '出去，快跑。不是警告，是保护。' },
  ],

  ch3_run_out: [
    { speaker: '', text: '他转身跑——跑过暗室，跑上台阶，跑出地下室，跑进铺子里——' },
    { speaker: '', text: '铺子里所有的纸人，都转过来面对着他。全部的。货架上的，地面上的，大的小的，全部转过来，用那些画出来的眼睛，看着他。', sanity: -15 },
    { speaker: '陈安（内心）', text: '脚本能地要停下来，但意识一遍遍地喊：跑，跑，快跑。' },
    { speaker: '', text: '冲出铺子，跑到街道中央，大口喘气。身后，铺子里的灯一盏一盏地灭了。然后，黑暗里，两盏门口的红灯笼，在无风的夜里，轻轻地往他的方向摇了摇。' },
    { speaker: '陈安（内心）', text: '像是在跟他打招呼。', hope: 5 },
    { speaker: '陈安（内心）', text: '他低下头，发现自己已经泪流满面，不知道从什么时候开始的。' },
  ],

  ch4_morning: [
    { speaker: '', text: '他在铺子外面的石阶上坐到天亮。没有地方可以去，不想回老宅，不敢进铺子，就那么坐着，看着黑暗一点一点地被灰白的天光稀释。' },
    { speaker: '张意', text: '你打开了？', portrait: 'zhangyi' },
    { speaker: '陈安', text: '打开了。纸人全都转过来看我。', portrait: 'chengan' },
    { speaker: '张意', text: '它跑出来了。那个煞。但你爷爷也跑出来了——他是保护你的，不是害你的。那四个字，是他帮你挡住了煞，给你争取了时间。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '现在那个煞在哪里？', portrait: 'chengan' },
    { speaker: '张意', text: '……', portrait: 'zhangyi' },
    { speaker: '陈安', text: '张意，你脖子后面的符文还在吗？', portrait: 'chengan' },
    { speaker: '张意', text: '在的。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '那个符文是做什么用的？', portrait: 'chengan' },
    { speaker: '张意', text: '是封印符，贴在颈后，是为了让里面的东西出不来。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '里面，是什么东西？', portrait: 'chengan' },
  ],

  ch4_truth_room: [
    { speaker: '', text: '陈安走进铺子最深处，推开那扇总是关着的内门。里面是一间密室，四壁全是纸，上面密密麻麻写满了字——都是名字，都是年份。', sanity: -10 },
    { speaker: '张老头', text: '你都想清楚了？', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '差不多。那个煞，不是从外面来的，是你们自己造的——每次封存一个魂，就需要喂那个东西，让它不闹事。那些名字，那些纸宅，不是无辜死去的人，是被喂给它的……', portrait: 'chengan' },
    { speaker: '张老头', text: '是祭品。自愿的，没有一个是强迫的。每一个都知道，每一个都签了字。', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '我奶奶也是。', portrait: 'chengan' },
    { speaker: '张老头', text: '是。', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '你们维持了这么多年，为了什么？', portrait: 'chengan' },
    { speaker: '张老头', text: '当时我曾祖父以为，封住它，再慢慢找驱散它的办法。但那个东西学会了跟它封进去的魂粘连，粘得太深，你要驱散它，就要同时毁掉那些魂，包括你爷爷的。', portrait: 'zhanglaotou' },
    { speaker: '陈安（内心）', text: '所以后来，没有人敢动它。而我奶奶，一辈子都在等一个两全其美的办法。' },
    { speaker: '张老头', text: '你奶奶的名字在那堵墙上——不是封存，是她最后一步棋。她主动选择了死亡，把所有线索留给你，让你走完全程。', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '钥匙是她藏的，但不是要阻止我——是要让我来，让我在知道全部真相之后，再做选择。', portrait: 'chengan' },
    { speaker: '张老头', text: '你奶奶说，驱散之法是化解执念。那个煞的本质是执念，找到它的本体，让它的执念得到回应——让它被看见。', portrait: 'zhanglaotou' },
  ],

  ch4_sha_origin: [
    { speaker: '张老头', text: '那个煞，是你曾祖父的老友——一个教私塾的先生，因为家人在战乱里失散，带着执念死在了这条街上，死不瞑目，执念化煞。', portrait: 'zhanglaotou' },
    { speaker: '张老头', text: '你曾祖父认识他，压它，是因为不忍心驱散他，只想把他关住，等……等找到他的家人。', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '他的家人，找到了吗？', portrait: 'chengan' },
    { speaker: '张老头', text: '找到了，又没找到。他的女儿当年走散了，辗转回来，但他已经化煞了，认不出她，只是对所有靠近的人放煞气。她后来嫁到清溪镇，生了孩子……', portrait: 'zhanglaotou' },
    { speaker: '陈安', text: '那个女儿的后代，在这里。', portrait: 'chengan' },
    { speaker: '张老头', text: '在这间屋子里。你奶奶查了三十年，最后查明白了。那个煞，是你爷爷他奶奶的父亲——就是陈家的祖上。', portrait: 'zhanglaotou' },
    { speaker: '陈安（内心）', text: '整个世界转了一圈，在脑子里重新落定。', sanity: -5, hope: 20, flag: 'know_truth', flag2: 'sha_is_family' },
    { speaker: '陈安（内心）', text: '陈安，是那个煞的血脉。他们是一家人。' },
    {
      speaker: '', text: '现在，是否相信这一切？',
      choices: [
        { text: '「我相信你。」', hope: 10, flag: 'trust_truth' },
        { text: '「我……不确定。但我会去做。」', sanity: -10 },
      ]
    },
  ],

  epilogue_rain: [
    { speaker: '', text: '中元节那天，清溪镇下了雨。不是大雨，是那种细密的、连绵的、江南特有的雨，把整座镇子罩在一层灰白的雾气里。' },
    { speaker: '', text: '空气里有烧纸的烟——镇子里好几家门口都点着火盆，纸钱的灰在雨里飞旋，像是无处安放的魂魄在找方向。' },
    { speaker: '张意', text: '方案很简单：分头走，把镇子夹在中间，往槐树方向靠拢。遇见那个东西，就把铜钱丢出去，声音对方能听见。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '你不用去，这是我的事。', portrait: 'chengan' },
    { speaker: '张意', text: '你不知道那个东西的形态，你一个人出去，遇见它都不一定认得出来。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '那它是什么形态？', portrait: 'chengan' },
    { speaker: '张意', text: '不定，它会模仿它见过的人。遇见任何人都不能信——只有一个方法能辨认它：它模仿不了符文，看颈后。没有符文的，就是它。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '好。', portrait: 'chengan' },
  ],

  epilogue_sha_encounter: [
    { speaker: '', text: '陈安走进雨里，衣服很快就湿了。走过老宅，走过药材铺，走过好几户挂着花圈的门口——' },
    { speaker: '', text: '迎面遇见了叔父。他呆呆地站在雨里，雨水顺着头发流下来，他也不躲，眼神空洞。' },
    { speaker: '叔父陈国生（？）', text: '安儿。' },
    { speaker: '陈安（内心）', text: '那个笑——嘴角上翘的弧度，不像笑，像是什么东西被钉在了笑的形状里。' },
    { speaker: '陈安', text: '叔父，你认识我吗？', portrait: 'chengan' },
    { speaker: '叔父陈国生（？）', text: '认识，你是安儿，你是陈安。' },
    { speaker: '陈安', text: '那你说，你叫什么名字？', portrait: 'chengan' },
    { speaker: '', text: '停顿了太长时间。那个叔父的形态慢慢偏了，脸上的笑拉长到人脸不该有的角度，眼睛里的瞳孔扩开，扩成一片黑……', sanity: -10 },
    { speaker: '陈安（内心）', text: '这是煞。颈后空的，没有符文。是它。' },
    { speaker: '', text: '陈安把铜钱丢了出去——清脆的一声响在雨里传开。', sfx: 'coin' },
    { speaker: '陈安（内心）', text: '然后转身跑。' },
  ],

  epilogue_run: [
    { speaker: '', text: '那个东西追上来的速度很快，不像人跑，更像是空间在身后折叠——每次回头，它就离近了一截，但身后一片空旷，什么都看不见。', sanity: -5 },
    { speaker: '', text: '陈安没有停，一直跑，往槐树的方向跑。雨水打在脸上，脚踩在湿滑的青石板上打滑，摔了一跤，爬起来继续跑。' },
    { speaker: '', text: '槐树近了——雨中的老槐树，半截焦黑，半截苍绿，像是分裂成了两个时态的存在。' },
    { speaker: '陈安（内心）', text: '他跑到树下，停下来，转过身。那个东西停了，就停在几步之外，没有形态，但感觉到它在那里——沉的，湿的，充满了某种绵延了六十年的悲哀。' },
  ],

  epilogue_blood_prompt: [
    { speaker: '陈安（内心）', text: '把手心划开，用鲜血在地面上画符。张老头写给我的，我背下来的：一横一竖一个圆，中间是一个「家」字。最古老的符，不是驱邪，是认亲。' },
  ],

  epilogue_dispel: [
    { speaker: '陈安', text: '太太太爷爷，我是陈安，陈志明的孙子，陈家的后代，我在这里。', portrait: 'chengan' },
    { speaker: '', text: '雨声很大，声音几乎被淹没了。然后空气里有什么东西变了——' },
    { speaker: '', text: '那个沉重慢慢地松动，像一块压了很久的石头开始移动。那种悲哀的气息开始从重变轻，从浓变淡，像是晨雾遇见了太阳……', hope: 30, sanity: 10 },
    { speaker: '', text: '不是消失，是散开——化进空气里，化进雨里，化进这片他们都生活过的土地里。', flag: 'sha_dispersed' },
    { speaker: '张意', text: '成了。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '成了。', portrait: 'chengan' },
    { speaker: '陈安（内心）', text: '然后他想起了那个漏洞——那个他在出发前没想清楚的逻辑漏洞。' },
    { speaker: '陈安', text: '张意，你颈后的符文，你说是封住里面的东西的。但那个东西在纸宅里，是我打开钥匙才让它跑出来的——那之前，你颈后封住的是什么？', portrait: 'chengan' },
    { speaker: '张意', text: '是我自己。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '……', portrait: 'chengan' },
    { speaker: '张意', text: '我告诉你，张德昌把那个三岁女孩的魂封在了纸人里……那个纸人，就是我。我活了很多年，后来找到了宿体，就是我现在这个形态。颈后的符，是我爷爷刻的，防止我的本质散出来。', portrait: 'zhangyi' },
    { speaker: '陈安', text: '那你是……', portrait: 'chengan' },
    { speaker: '张意', text: '我是活着的，陈安。我吃饭，我睡觉，我感觉冷和热，我感觉……很多东西。我和你不一样，但我活着。', portrait: 'zhangyi' },
    { speaker: '陈安（内心）', text: '她的皮肤是那种半透明的白，她的手是凉的，她在傍晚提着灯笼，她在认真地给纸房子糊云朵形的屋顶，她在夜里把伞举在他头顶……' },
    { speaker: '陈安（内心）', text: '他想了很多想来想去，最后发现他想到的全部都是她这个人，而不是她的本质。' },
    { speaker: '陈安', text: '我知道。你活着。', portrait: 'chengan' },
  ],
};
