# dotfiles

Personal dotfiles and configuration for macOS development environment.

## contents

- **scripts/** — shell automation scripts
- **vscode/** — VS Code settings and recommended extensions
- **macos/** — launchd agents and Automator workflows
- **services/** — Automator Quick Actions for Finder

## scripts

| script | description |
|--------|-------------|
| `clean` | updates homebrew, mas, npm, pip and clears system caches, logs, browser data, and junk files |
| `netinfo` | displays local ip, public ip, gateway, dns, and wifi network name |
| `git-clean-branches` | scans all git repos in a folder and removes local branches already merged or with deleted remotes |

### install scripts

```sh
git clone https://github.com/chakri192/dotfile ~/.dotfiles
cd ~/.dotfiles
chmod +x clean netinfo git-clean-branches
```

Add to your PATH in `~/.zshenv`:

```sh
export PATH="$HOME/.dotfiles:$PATH"
```

### usage

```sh
clean       # run full system cleanup + updates
netinfo     # show network info
git-clean-branches            # preview merged/stale branches in current dir
git-clean-branches ~/code -y  # delete them across all repos in ~/code
```

### dependencies

- `zsh` — required shell
- `curl` — used by netinfo for public ip lookup
- `brew` — homebrew package manager
- `mas` — mac app store cli (`brew install mas`)
- `npm`, `pip3` — optional, skipped if not installed
- `git` — required by git-clean-branches

### git-clean-branches

Scans every git repo one level deep inside a given folder (defaults to the current directory) and identifies local branches that are safe to remove:

1. Branches already merged into `main`/`master`
2. Branches whose remote-tracking branch has been deleted (shows as `gone` in `git branch -vv`)

`main` and `master` are never touched, and branches with unmerged commits are skipped unless `-f` is passed.

```sh
git-clean-branches                  # preview only, scans current directory
git-clean-branches ~/Projects       # preview only, scans given path
git-clean-branches -y               # actually delete what's found, current dir
git-clean-branches ~/Projects -y    # actually delete what's found
git-clean-branches ~/Projects -y -f # delete, force (-D) even if unmerged
```

Defaults to preview mode (no changes made) unless `-y` is passed.

## VS Code configuration

Optimized settings for Python, JavaScript/TypeScript, C/C++, and web development.

### features

- **Performance**: Disabled accessibility/telemetry, smooth scrolling, optimized minimap
- **Typography**: JetBrains Mono with ligatures, 13.5px editor font
- **File management**: Smart nesting for related files (e.g., `.ts` with `.js`, `.h` with `.c`)
- **Formatting**: Prettier (JS/JSON), Ruff (Python) with format-on-save
- **Quality of life**: Bracket colorization, sticky scroll, linked editing, bracket guides
- **Language overrides**: Python (Ruff + imports), Markdown (word wrap, no format), JSON

### setup

#### Step 1: Copy settings to VS Code

The `vscode/settings.json` file should be copied to VS Code's user settings directory:

```sh
cp vscode/settings.json ~/Library/Application\ Support/Code/User/settings.json
```

**Or manually in VS Code:**
1. Open `vscode/settings.json` from this repo
2. Copy all contents
3. In VS Code: `Code` → `Preferences` → `Settings` → click `{}` (JSON tab)
4. Paste the contents

#### Step 2: Install recommended extensions

Open VS Code and navigate to **Extensions** → **Recommended** to see all extensions at once, then install.

**Or install via terminal:**
```sh
code --install-extension ms-python.python
code --install-extension charliermarsh.ruff
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension eamodio.gitlens
code --install-extension vscode-icons-team.vscode-icons
```

See `vscode/extensions.json` for the complete list of 20+ recommended extensions:

**Categories:**
- **Python**: Python, Ruff, Pylance, Jupyter
- **Web**: ESLint, Prettier, CSS Peek, Path Intellisense
- **Version Control**: GitLens, GitHub Pull Requests
- **AI**: GitHub Copilot Chat, Gemini Code Assist, Continue
- **Utilities**: Error Lens, Hex Editor, YAML, EditorConfig

#### Notes

- Files in `vscode/` map to VS Code's hidden `.vscode/User/` directory
- The `vscode/extensions.json` format is standard for VS Code workspace recommendations
- All settings are commented and organized by feature for easy customization

## macOS automation

launchd agents and Automator Services for system-level automation.

| item | type | description |
|------|------|-------------|
| `com.user.capslock-remap.plist` | launchd agent | remaps Caps Lock to Forward Delete |
| `Send to Gmail.workflow` | Automator Service | emails selected Finder files as attachments |

### capslock-remap

- Runs at every login (`RunAtLoad`) via `hidutil`
- Remaps HID usage `0x700000039` (Caps Lock) → `0x70000004C` (Forward Delete)
- Re-applied on every login since `hidutil` mappings don't persist across reboots

```sh
hidutil property --get "UserKeyMapping"          # inspect current mapping
hidutil property --set '{"UserKeyMapping":[]}'   # clear all remaps
```

### send to gmail

- Finder Service — right-click a selection → **Services → Send to Gmail**
- Reads selected file paths from stdin into a bash array
- Builds an AppleScript fragment attaching each file to a new message
- Sends silently via `Mail.app` (`visible:false`) and shows a "Sent!" notification on success
- Recipient is hardcoded as a placeholder — edit `Contents/document.wflow` and replace `your-email@gmail.com` before use

### install

```sh
cp macos/launchagents/com.user.capslock-remap.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.user.capslock-remap.plist

cp -R "macos/automator/Send to Gmail.workflow" ~/Library/Services/
```

### dependencies

- `hidutil` — built into macOS, used by capslock-remap
- `Mail.app` — required by Send to Gmail, must have a configured account

## services

Automator Quick Actions registered as Finder Services.

| item | type | description |
|------|------|-------------|
| `New Item.workflow` | Automator Quick Action | creates a new file or folder in the current Finder directory |

### finder-new-item

Adds a **New Item** entry to Finder's Services menu — replicating the Windows right-click New submenu on macOS.

Supports 10 types: Folder, `.txt`, `.md`, `.rtf`, `.html`, `.sh`, `.py`, `.js`, `.json`, `.c`

> **Note:** macOS does not allow Automator Services to inject entries directly into
> Finder's right-click context menu. That requires a native **Finder Sync Extension**
> built with Xcode. The Automator approach surfaces the action via:
>
> `Finder menu bar → Services → New Item`
>
> To build a true right-click integration, see [Xcode: Creating a Finder Sync Extension](https://developer.apple.com/documentation/findersync).

### install

```sh
cp -r "services/finder-new-item/New Item.workflow" ~/Library/Services/
/System/Library/CoreServices/pbs -update ~/Library/Services/"New Item.workflow"
killall Finder
```

Enable under `System Settings → Keyboard → Keyboard Shortcuts → Services → General → New Item`

### usage

`Finder menu bar → Services → New Item` → pick type → inline rename fires automatically

### dependencies

- `Automator.app` — built into macOS
- `System Events` — used for post-creation rename trigger

## environment

macOS (Apple Silicon) · zsh · VS Code · tested on M4 MacBook Air

### AI tooling

Documentation assisted by local LLMs via [Ollama](https://ollama.com):

| Model | Used for |
|-------|----------|
| `qwen2.5-coder:7b` | Code suggestions, refactoring |
| `llama3.1:8b` | Prose, documentation, commit messages |
