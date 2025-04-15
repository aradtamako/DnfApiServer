import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { buildCallbackObject, buildRequestUrl, Parameters } from './util'

export const server = new McpServer({
  name: 'DNF API Server',
  version: '0.0.1',
})

server.tool(
  'getServerList',
  'サーバーリストを取得する',
  {
    apikey: z.string().describe('APIキー')
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }

    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacter',
  'キャラクターを検索する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterName: z.string().describe('キャラクター名'),
    jobId: z.string().optional().describe('職業ID'),
    jobGrowId: z.string().optional().describe('転職ID'),
    isAllJobGrow: z.boolean().optional().default(false).describe('Retrieve all related advancements when jobGrowId is input'), // 詳細不明
    wordType: z.enum(['match', 'full']).describe('検索タイプ'),
    limit: z.number().min(1).max(50).describe('件数')
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim(),
      characterName: args.characterName,
      jobId: args.jobId,
      jobGrowId: args.jobGrowId,
      isAllJobGrow: args.isAllJobGrow ? 'true': 'false',
      wordType: args.wordType,
      limit: args.limit,
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacterBasicInformation',
  'キャラクターの基本情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'getCharacterTimeline',
  `
  キャラクターのタイムライン情報を取得する。

  # タイムラインコード
  |id|detail|
  |:----|:----|
  |101|キャラクター作成|
  |102|キャラクター名変更|
  |103|キャラクター転職|
  |104|キャラクター最高レベル達成|
  |105|冒険短命変更|
  |201|レイド|
  |202|悲しみの塔征服|
  |203|絶望の塔征服|
  |204|（旧）魔獣ダンジョン討伐|
  |205|帝国闘技場ハードモードクリア|
  |206|魔獣ダンジョン討伐|
  |207|ピンドワークリア|
  |208|墓の塔征服|
  |209|レギオンクリア|
  |210|レイド（先発隊）|
  |301|決闘場経験値等級上昇|
  |401|アイテム強化|
  |402|アイテムの増幅|
  |403|アイテムの再練|
  |404|アイテム改造|
  |405|アイテムの刻み|
  |406|アイテム継承|
  |407|アイテム鍛造|
  |501|封印された南京錠アイテム獲得|
  |502|レジェンダリー獲得|
  |503|エコンレジェンダリー獲得|
  |504|アイテム獲得（壺＆箱）|
  |505|アイテム獲得（ダンジョンドロップ）|
  |506|アイテム獲得（彫刻交換）|
  |507|アイテム獲得（レイドカード報酬）|
  |508|アイテム獲得（ショップ）|
  |509|アイテム超越転送（NPC）|
  |510|アイテム交換|
  |511|アイテム獲得（アップグレード）|
  |512|力|
  |513|アイテム獲得（ダンジョンカード報酬）|
  |514|アイテム獲得（製作書）|
  |515|アイテム超越受領（NPC）|
  |516|アイテム超越（超越の石）|
  |517|アイテム融合分離|
  |518|特殊アイテム獲得|
  |519|アイテム変換|
  |520|アイテム獲得（装備製作）|
  |521|アイテム獲得（レイドオークション報酬）|
  |601|ルーン獲得|
  |602|タリスマン獲得|
  `,
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
    startDate: z.date().optional().describe('検索開始日(例. 20250101)'),
    endDate: z.date().optional().describe('検索終了日(例. 20250131)'),
    limit: z.number().max(100).optional().describe('件数'),
    code: z.string().optional().describe('タイムラインコード'),
    next: z.string().optional().describe('次のデータ検索をするときのページネーション用のID')
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim(),
      startDate: args.startDate,
      endDate: args.endDate,
      limit: args.limit,
      code: args.code?.trim(),
      next: args.next?.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}/timeline`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacterEquippedEquipment',
  'キャラクターが装備している装備の情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}/equip/equipment`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacterEquippedAvatar',
  'キャラクターが装備しているアバターの情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}/equip/avatar`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacterEquippedCreature',
  'キャラクターが装備しているクリーチャーの情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}/equip/creature`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacterEquippedFlag',
  'キャラクターが装備している徽章の情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}/equip/flag`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacterEquippedTalisman',
  'キャラクターが装備しているタリスマンの情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}/equip/talisman`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacterSkill',
  'キャラクターのスキル情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}/skill/style`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacterSkillBuffEquipment',
  'キャラクターが装備しているバフスキル強化装備の情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}/skill/buff/equip/equipment`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacterSkillBuffAvatar',
  'キャラクターが装備しているバフスキル強化アバターの情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}/skill/buff/equip/avatar`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharacterSkillBuffCreature',
  'キャラクターが装備しているバフスキル強化クリーチャーの情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    characterId: z.string().describe('キャラクターID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters/${args.characterId}/skill/buff/equip/creature`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'searchCharactersByFame',
  'キャラクターを名声値で検索する。serverIdに all を指定する事で全サーバーを検索することができる。',
  {
    apikey: z.string().describe('APIキー'),
    serverId: z.string().describe('サーバーID'),
    minFame: z.number().optional().describe('最小名声値'),
    maxFame: z.number().optional().describe('最大名声値'),
    jobId: z.string().optional().describe('職業ID'),
    jobGrowId: z.string().optional().describe('転職ID'),
    isAllJobGrow: z.boolean().optional().default(false).describe('Retrieve all related advancements when jobGrowId is input'), // 詳細不明
    isBuff: z.boolean().optional().describe('バッファーのみ検索する場合は true を指定する。ディラーのみを検索する場合は false を指定する。全て検索する場合は値を指定しない。'),
    limit: z.number().max(200).optional().describe('件数')
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim(),
      minFame: args.minFame,
      maxFame: args.maxFame,
      jobId: args.jobId,
      jobGrowId: args.jobGrowId,
      isAllJobGrow: args.isAllJobGrow,
      isBuff: args.isBuff,
      limit: args.limit
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/servers/${args.serverId}/characters-fame`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

// 未実装 16. 경매장 등록 아이템 검색
// 未実装 17. 경매장 등록 아이템 조회
// 未実装 18. 경매장 시세 검색
// 未実装 19. 아바타 마켓 상품 검색
// 未実装 20. 아바타 마켓 상품 조회
// 未実装 21. 아바타 마켓 상품 시세 검색
// 未実装 22. 아바타 마켓 상품 시세 조회
// 未実装 23. 아바타 마켓 해시태그 조회
// 未実装 24. 아이템 검색
// 未実装 25. 아이템 상세 정보 조회
// 未実装 26. 아이템 상점 판매 정보 조회
// 未実装 27. 다중 아이템 상세 정보 조회
// 未実装 28. 아이템 해시태그
// 未実装 29. 세트 아이템 검색
// 未実装 30. 세트 아이템 상세 정보 조회
// 未実装 31. 다중 세트 아이템 상세 정보 조회

server.tool(
  'getJobs',
  '職業のマスタデータを取得する',
  {
    apikey: z.string().describe('APIキー')
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/jobs`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'getSkill',
  'スキルのマスタデータを取得する',
  {
    apikey: z.string().describe('APIキー'),
    jobId: z.string().describe('職業ID'),
    jobGrowId: z.string().describe('転職ID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim(),
      jobGrowId: args.jobGrowId.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/skills/${args.jobId}`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)

server.tool(
  'getSkillDetail',
  'スキルの詳細情報を取得する',
  {
    apikey: z.string().describe('APIキー'),
    jobId: z.string().describe('職業ID'),
    skillId: z.string().describe('スキルID'),
  },
  async (args) => {
    const parameters: Parameters = {
      apikey: args.apikey.trim()
    }
    const url = buildRequestUrl(`https://api.neople.co.kr/df/skills/${args.jobId}/${args.skillId}`, parameters)
    const response = await fetch(url)
    const text = await response.text()
    return buildCallbackObject(text)
  }
)
