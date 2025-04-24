import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from '../src/adapter/in/web/game.controller';
import { GameService } from '../src/application/service/game.service';
import { BoardState } from '../src/domain/model/game.types';

// GameController のテストスイート開始
describe('GameController', () => {
  // テスト内で使用する controller と service の変数を宣言
  let controller: GameController;
  let gameService: Partial<Record<keyof GameService, any>>;

  // モックとして使う盤面の状態（15x15 の空の盤面 + プレイヤー A）
  const mockBoardState: BoardState = {
    board: Array(15).fill(null).map(() => Array(15).fill(null)),
    currentPlayer: 'A',
    winner: null,
  };

  // 各テストの前にモジュールと依存関係を初期化する
  beforeEach(async () => {
    // GameService の全メソッドを jest.fn() でモックにする
    gameService = {
      getBoard: jest.fn().mockReturnValue({ success: true, data: mockBoardState }),
      resetBoard: jest.fn().mockReturnValue({ success: true, data: mockBoardState }),
      makeMove: jest.fn().mockReturnValue({ success: true, data: mockBoardState }),
      registerPlayer: jest.fn().mockResolvedValue(3), // Promise を返す async 関数
    };

    // Nest のテストモジュールを構築（コントローラーと依存サービスを登録）
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [{ provide: GameService, useValue: gameService }],
    }).compile();

    // モジュールから GameController のインスタンスを取得
    controller = module.get<GameController>(GameController);
  });

  // GET /game エンドポイントの動作確認
  it('should return board on getBoard', () => {
    const result = controller.getBoard(); // getBoard を呼び出し
    expect(result.success).toBe(true); // 成功レスポンスであることを確認
    expect(result.data?.board).toBeDefined(); // board が存在することを確認
  });

  // POST /game/reset エンドポイントの動作確認
  it('should reset the board on resetBoard', () => {
    const result = controller.resetBoard(); // resetBoard を呼び出し
    expect(result.success).toBe(true); // 成功レスポンスであることを確認
    expect(result.data).toBeDefined(); // data が存在することを確認
    expect(result.data!.currentPlayer).toBe('A'); // 初期プレイヤーが A であることを確認
  });

  // POST /game/move エンドポイントの動作確認
  it('should make a move on makeMove', () => {
    const res = controller.makeMove({ X: 0, Y: 0, player: 'A' }); // マス (0,0) に A が手を打つ
    expect(res.success).toBe(true); // 成功レスポンスを確認
  });

  // POST /game/register エンドポイントの動作確認
  it('should register a player and return visit count', async () => {
    const res = await controller.registerPlayer({ name: 'TestPlayer' }); // プレイヤー名を送信
    expect(res.success).toBe(true); // 成功レスポンスであることを確認
    expect(res.visits).toBe(3); // モックで 3 を返す設定になっているので 3 を期待
  });
});
