### 分析ツール
### 定義書
https://docs.google.com/spreadsheets/d/1aIQUrQJnaSGfY9RUk6xLzJSMIxcqqStwix6L1RMK89E/edit?usp=sharing

#### GA4
https://support.google.com/analytics/answer/10089681?hl=ja
#### GA4 イベント
https://support.google.com/analytics/answer/9322688?hl=ja&sjid=9509758915224139161-AP&visit_id=638575836560146384-1404215426&ref_topic=14709789&rd=1#zippy=%2Cリアルタイム-レポート%2Cdebugview-レポート
イベントを使用すると、Webサイトやアプリでの特定のインタラクションや事象を測定できる。  
![2024-07-26 18.59.26.png](2024-07-26%2018.59.26.png)
##### デフォルトで収集できるイベント
gtag.jsを使用する場合にデフォルトで収集できるイベント
https://support.google.com/analytics/answer/9234069?hl=ja&ref_topic=14710097&sjid=9509758915224139161-AP

| イベント                | トリガータイミング                                             | パラメータ                                                                                                                                                                            |
| ------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| click               | リンクをクリックするたび                                          | link_classes, link_domain, link_id, link_url, outbound(ブール値)                                                                                                                     |
| file_download       | ユーザーがファイルに移動するリンクをクリック                                | file_extension, file_name, link_classes, link_id, link_text, link_url                                                                                                            |
| first_visit         | 初めてユーザーが訪問した時                                         |                                                                                                                                                                                  |
| form_start          | ユーザーがセッションでフォームに初めてアクセスした時                            | form_id, form_name, form_destination                                                                                                                                             |
| form_submit         | ユーザーがフォームを送信した時                                       | form_id, form_name, form_destination, form_submit_text                                                                                                                           |
| page_view           | ページが読み込まれるたび,<br>閲覧履歴のステータスが変更されるたび                   | page_location, <br>page_referrer, <br>engagement_time_msec                                                                                                                       |
| scroll              | ユーザーがページの最下部まで初めてスクロールしたとき                            | engagement_time_msec                                                                                                                                                             |
| session_start       | ユーザーがサイトを利用した時                                        |                                                                                                                                                                                  |
| user_engagement     | サイトにフォーカスがある状態が1s以上続いた時                               | engagement_time_msec                                                                                                                                                             |
| video_complete      | 動画が終了した時<br>(YouTubeのみ)                               | video_current_time, video_duration,<br>video_percent, video_provider,<br>video_title, video_url, visible(ブール値)                                                                   |
| video_progress      | 動画が再生時間の10%, 25%, 50%, 75%まで進んだ時<br>(Youtubeのみ)       | video_current_time, video_duration,<br>video_percent, video_provider, <br>video_title, video_url, visible(ブール値)                                                                  |
| video_start         | 動画の再生が開始された時                                          | video_current_time, video_duration,<br>video_percent, video_provider, <br>video_title, video_url, visible(ブール値)                                                                  |
| view_search_results | ユーザーがサイト内検索を行うたびにに記録され、<br>URLクエリパラメータが含まれてるかどうかで示される | search_termと、必要に応じて`q_<additional key = "">` (additional key = "" が詳細設定で収集するよう指定している追加のクエリパラメータに一致する場合) <br>注: 値が 1（例: 文字列がセッション固有）の場合、unique_search_term パラメータのみがこのイベントで送信されます。 |



**全ページ**
- PV数 (Page View)
    - ユーザーがWebページを表示した回数「表示回数」
    - 同じページを読み直した場合でもPV数はカウントされる
- UU数(Unique User)
    - 何人のユーザーが閲覧したかを表す
    - Aさんがページを3つみて離脱した場合、PV数は3になるが、UU数は1になる
- 滞在時間
- ページロード時間
- デバイス情報や使用ブラウザの取得
- 直帰率
> 直帰率について
> 直帰とは、サイト内の 1 ページしか閲覧されなかったセッションのことです。アナリティクスにおける直帰は、ユーザーがサイトの 1 ページのみを閲覧し、そのセッションでアナリティクス サーバーに他のリクエストを行うことなくサイトを離脱した場合など、単一リクエストのみを行うセッションとして計算されます。
> 直帰率とは、1 ページのみのセッション数をすべてのセッション数で割った値です。つまり、すべてのセッションの中で、ユーザーが 1 ページのみ閲覧して、Google アナリティクス サーバーに対するリクエストを 1 回のみ行ったセッションが占める割合のことです。
>
直帰率の高さが問題になるのは、ユーザーがサイト内の複数のページを閲覧することが必要な場合です。たとえば、サイトのトップページがサイト内の他のページ（ニュース記事、商品ページ、購入手続きなど）の入り口として機能している状況で、多くのユーザーがトップページのみを閲覧しているとすると、高い直帰率は望ましくありません。  
https://support.google.com/analytics/answer/1009409?hl=j

**トップページ**
- 記事クリックイベント
- スクロール深度

**詳細ページ**
- 続きを読むボタンのクリック
- ページネーションの使用、どこまで見たか
- 関連記事やピックアップ記事のクリック
- 広告のクリック
- ページ読了率: スクロール深度と滞在時間の組み合わせ


**ユーザーフロー分析**
- 入口ページと出口ページの追跡(UTMパラメータ)

**サイト内分析
- 検索キーワードの記録
- 最も読まれたタグ
- 最も読まれたカテゴリ

### GTM
### 仮想DOMとGTMとの付き合い方
要素の表示やクリックなどのトリガーに関して、class名やid名などのDOMの情報に対して条件を絞り、イベントを制御するが、仮想DOMは消失したり入れ替わったりするため、必ずしもGTMがその仮想DOMを正しく検知できるとは限らない
そのため、GTM既存の要素の表示やクリックに依存しない設計が理想
カスタムイベントトリガーでイベントを制御する。
https://qiita.com/cheez921/items/a9e8d257684098db55c3#モダンフロント技術におけるgtmの問題
