/* eslint-disable jsx-a11y/no-autofocus */
import {
  ActionFunctionArgs,
  json,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { ListTodo, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix DB hands-on" },
    { name: "description", content: "Remix hands-on application!" },
  ];
};

/**
 * Taskの型定義
 */
type TaskRecord = {
  id: number;
  label: string | null;
  status: boolean;
};

/**
 * _index.tsxがGETで読み込まれる際に
 * Index() をレンダリングする前に実行される関数
 */
export const loader = async () => {
  // dummy tasks
  const result: TaskRecord[] = [
    { id: 1, label: "タスク1", status: true },
    { id: 2, label: "タスク2", status: false },
    { id: 3, label: "タスク3", status: false },
  ];

  /**
   * DBからタスクリストを取り出す部分(SELECT)
   */

  // 正常終了
  return json({ tasks: result }, { status: 200 });
};

/**
 * Form, fewtcher.Formがサブミットされた際に
 * 何らかの処理を行うサーバー関数
 * 今回は処理内容によってmethodを変えているので
 * 各methodに応じた処理をif文で分岐する
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  /**
   * 新規タスク作成（POST）
   */
  if (request.method === "POST") {
    const formData = await request.formData();
    const label = formData.get("todo") as string;

    if (!label || label === null) {
      console.error("TODOが入力されていません");
      throw new Response("There are no todo", { status: 400 });
    }

    /**
     * 新規タスクをDBに登録する
     */
    console.log("INSERT DB ->", label);

    // 正常終了
    return redirect("/");
  } else if (request.method === "PUT") {
    /**
     * タスク状態更新（PUT）
     */
    const body = await request.json();
    const id = body.id as number;
    const status = !body.status;

    if (!id || id === null) {
      console.error("チェックする対象のIDが存在しません");
      throw new Response("ID not found", { status: 400 });
    }

    /**
     * タスクのチェック状態を更新する
     */
    console.log("UPDATE TASKS ->", id, status);

    // 正常終了
    return json({ message: "OK" }, { status: 200 });
  } else if (request.method === "DELETE") {
    /**
     * タスク削除（DELETE）
     */
    const formData = await request.formData();
    const id = formData.get("id") as unknown as number;

    if (!id || id === null) {
      console.error("削除する対象のIDが存在しません");
      throw new Response("ID not found", { status: 400 });
    }

    /**
     * 指定されたIDのタスクを削除する
     */
    console.log("DELETE TASKS ->", id);

    // 正常終了
    return redirect("/");
  } else {
    /**
     * methodが見つからない場合405を返す
     */
    throw new Response("Method not found", { status: 405 });
  }
};

export default function Index() {
  // task表示用データをloaderから取得
  const { tasks }: { tasks: TaskRecord[] } = useLoaderData<typeof loader>();

  // 新規タスク作成時、エンターキーを押したら入力欄をクリアするためkeyを設定する
  const location = useLocation();

  return (
    <div className="mt-5 bg-zinc-200 w-[600px] m-auto flex flex-col gap-2 justify-start items-center rounded-lg overflow-hidden">
      {/* タイトル */}
      <h1 className="w-full p-3 text-center bg-green-800 text-zinc-100 text-3xl">
        My Todo
      </h1>

      {/* コンテンツ部分 */}
      <div className="w-full h-full px-5">
        {/* 新規タスク入力フォーム */}
        <Form key={location.key} method="POST">
          <div className="pt-2 pb-4 px-2 flex flex-row justify-start items-center">
            <ListTodo size={28} className="mr-2" />
            <Input
              type="text"
              name="todo"
              placeholder="新規TODOを入力しエンターキーを押す"
              required
              autoFocus
            />
          </div>
        </Form>

        {/* タスクリスト表示部分 */}
        <div className="h-[420px] overflow-y-scroll pl-2 pr-4 pb-8">
          <ul>
            {/* タスク一覧の１レコード分を表示 */}
            {tasks &&
              tasks.map((rec) => (
                <div
                  key={rec.id}
                  className="flex flex-row justify-between items-center border-b border-zinc-400 border-dashed pt-2 pb-1"
                >
                  <div className="flex flex-row justify-start gap-2 items-center">
                    {/* チェックボックス */}
                    <CheckTask task={rec} />

                    {/* タスクラベル */}
                    <li className="w-full">{rec.label}</li>
                  </div>

                  {/* タスク削除ボタン */}
                  <DeleteTask task={rec} />
                </div>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * サブコンポーネント：チェックボックスON/OFF
 * @param task: タスク１レコード
 * @returns チェクボックス部品
 */
const CheckTask = ({ task }: { task: Pick<TaskRecord, "id" | "status"> }) => {
  /**
   * チェックボックスの状態変更のみでページ遷移を伴わないのでfetcherで更新する
   */
  const fetcher = useFetcher();
  const checked = task.status;
  const id = task.id;

  // チェックボックス状態が変わった時に呼ばれる処理
  const handleChecked = () => {
    fetcher.submit(
      {
        id: id,
        status: checked,
      },
      {
        method: "put",
        encType: "application/json",
      }
    );
  };

  return (
    <fetcher.Form>
      <Checkbox
        name={`checkbox-${id}`}
        checked={checked}
        onCheckedChange={handleChecked}
      />
    </fetcher.Form>
  );
};

/**
 * サブコンポーネント：タスク削除ボタン
 * @param task: タスク１レコード
 * @returns 削除ボタン
 */
const DeleteTask = ({ task }: { task: Pick<TaskRecord, "id"> }) => {
  /**
   * タスク削除により再描画を発生させたいのでFormを使う
   * （結果的にはあまり関係ない気もする・・・）
   * チェック更新と同じ構造にしたかったがmethod="delete"としないと
   * submitが発火しなかった。原因はわかっていない。
   */
  return (
    <Form method="delete" id={`delete-button-${task.id}`}>
      <input type="hidden" name="id" value={task.id} />
      <Button size="icon" variant="ghost" type="submit">
        <Trash size={20} className="text-destructive" />
      </Button>
    </Form>
  );
};
