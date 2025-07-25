# <img src="https://github.com/organization/lyrs/assets/16558115/447a957e-faf2-4759-8884-5d7b04fb1fbb" width="2%" /> Lyrs <a href="https://github.com/organization/lyrs/releases/latest"><img src="https://img.shields.io/github/downloads/organization/lyrs/total.svg"/></a>

### 커스텀이 편리한 *Spotify*, *YouTube Music* 가사 표시기

> `스포티파이` 혹은 `유튜브 뮤직`등의 `뮤직 플레이어`에서 재생중인 노래의 가사를 화면에 표시해줍니다.

### Screenshot

-   동영상 위에 가사가 표시되게 촬영한 예시 이미지이며, 실제로는 위치를 자유롭게 선택할 수 있습니다.

|                        Spotify                         |                                                        Youtube Music                                                        |
|:------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|
| ![Spotify Screenshot](https://i.imgur.com/0JJMhaU.png) | ![YouTube Music Screenshot](https://github.com/organization/lyrs/assets/16558115/fc22323e-d0b2-4abc-882e-2281c13f4cf4) |
|                                         Game Overlay (tested game: Overwatch)                                         | |
| ![Overlay Screenshot](https://github.com/organization/lyrs/assets/16558115/7bb95071-b8f7-45e1-af59-02e1586d5dcc) | |

## Installation

설치 방법은 다음과 같습니다.

### Spotify

#### 1.  [Spicetify 설치](https://github.com/khanhas/spicetify-cli)
-   다음 링크의 지시사항에 따라 `Spicetify`를 설치해주세요.

#### 2.  [Lyrs 다운로드](https://github.com/organization/lyrs/releases)

-   Release 탭에서 최신버전의 Lyrs을 다운로드한 후 설치해주세요. (포터블 버전은 설정이 저장되지 않습니다)
-   Windows 사용자께서는 `Lyrs-Web-Setup-[version].exe`을 다운로드 받으시면 됩니다.

#### 3.  Lyrs Companion 설치
| 1. 플러그인 설정 | 2. 확장 설치 버튼 누르기 |
|:------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|
| ![image](https://github.com/user-attachments/assets/e19f25f0-54f5-4ec5-9d4f-b1569fcd1c19) | ![image](https://github.com/user-attachments/assets/50003f4b-6e3d-434f-9f45-2d9d13dd0912) |

> [!NOTE]
> 플러그인이 존재하지 않는다면 아래 **수동 설치 방법**을 확인해주세요

<details>
  <summary>
    수동 설치 방법
  </summary>

-   [Spicetify 설치 위치의 Extensions](https://spicetify.app/docs/advanced-usage/extensions/) 폴더에 [`lyrs.js`를 다운로드 받아](https://powernukkit.github.io/DownGit/#/home?directFile=1&url=https://github.com/organization/lyrs/blob/master/extensions/lyrs.js) 넣어주세요.
-   아래 명령어를 사용하여 `lyrs.js` 확장을 `Spicetify`에 추가합니다.
    ```bash
    spicetify config extensions lyrs.js
    ```
-   그 뒤, 아래 명령을 사용하면 `Spotify`가 다시 시작되고 `lyrs.js` 확장 프로그램이 적용됩니다.
    ```bash
    spicetify apply
    ``` 

</details>

---

### YouTube Music

1.  [YouTube Music Desktop 설치](https://github.com/th-ch/youtube-music/releases)

  -   다음 링크의 지시사항에 따라 `Youtube Music Desktop`을 설치해주세요.

2.  `Youtube Music Desktop`을 실행하고, 상단 메뉴의 `plugins`를 클릭한 뒤 `tuna-obs`를 활성화해주세요.

3.  [Lyrs 다운로드](https://github.com/organization/lyrs/releases)

  -   Release 탭에서 최신버전의 Lyrs을 다운로드한 후 설치해주세요.
  -   Windows 사용자께서는 `Lyrs-Web-Setup-[version].exe`을 다운로드 받으시면 됩니다.

---

### 그 외 플레이어 (e.g. Apple Music)

#### 1.  [tuna-obs](https://github.com/univrsal/tuna)를 참고하여 브라우저 확장 프로그램을 (tempermonkey script) 설치해주세요.
#### 2.  [Lyrs 다운로드](https://github.com/organization/lyrs/releases)
-   Release 탭에서 최신버전의 Lyrs을 다운로드한 후 설치해주세요.
-   Windows 사용자께서는 `Lyrs-Web-Setup-[version].exe`을 다운로드 받으시면 됩니다.

---

### 마지막 단계

#### Windows, Linux

-   `Lyrs` 실행

#### macOS

-   `손상되었기 때문에 열 수 없습니다.` 메시지가 뜨고 앱이 실행되지 않는다면, 다음 명령어를 터미널에 입력하세요.
    ```bash
    xattr -cr /Applications/Lyrs.app
    ```
-   혹은 [해당 링크](https://archivers.tistory.com/74)를 참고하여 실행하세요.

## Config

1.  설정

|                                                   일반 설정                                                  |                                                   위치 설정                                                  |
| :------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| ![lyrs-settings-general](https://github.com/organization/lyrs/assets/13764936/8e4ec704-d533-4d82-ad60-ffa3f0793a9c) | ![lyrs-settings-position](https://github.com/organization/lyrs/assets/13764936/70f1fc41-0497-4b48-b3de-d745e7bb7c0b) |
|                                                   테마 설정                                                  |                                                   테마 상세 설정                                                  |
| ![lyrs-settings-theme-list](https://github.com/organization/lyrs/assets/13764936/c7d0436f-7bfa-4b36-a89e-dab36d0948bd) | ![lyrs-settings-theme](https://github.com/organization/lyrs/assets/13764936/f47f9483-411d-4536-b6bc-1e73655de254) |
|                                                   플러그인 설정                                                  |
| ![lyrs-settings-plugin](https://github.com/organization/lyrs/assets/13764936/dae59ec5-e9ea-49d7-bc5e-20a78a867d22) |

2.  트레이 아이콘의 `가사 선택`을 선택하여 현재 재생 중인 노래의 가사를 다른 가사로 교체할 수 있습니다.

|                                          곡을 검색하고, 다른 가사를 적용한 예제                                          |
| :------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/organization/lyrs/assets/16558115/171d97b3-79ff-4ede-b7a6-9905b7993b42) |

## Plugin
[문서](https://github.com/organization/lyrs/wiki/Plugin)를 참고하세요.

예제는 [여기](https://github.com/organization/lyrs/tree/master/example/lyrs-plugin)를 확인해주세요.


## LICENSE

`Apache License 2.0`

