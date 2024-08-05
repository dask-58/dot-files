syntax enable
syntax on

colorscheme koehler

set nocompatible          
set number               
set relativenumber      
set tabstop=4           
set shiftwidth=4        
set expandtab           
set smarttab             
set autoindent           
set smartindent         
set backspace=indent,eol,start 
set wrap
set mouse=a
set incsearch
set hlsearch
set ignorecase
set smartcase
set showmatch
set showcmd
set cmdheight=2
set history=1000
set numberwidth=4
set cursorline
set laststatus=2
set showcmd
set cursorline

if (has("termguicolors"))
  set termguicolors
endif

set showmode            
set wildmenu            
set lazyredraw          
set ttyfast            
set updatetime=300      
set ttimeoutlen=50     

vnoremap <C-c> "+y
nnoremap <C-p> "+gP
inoremap <C-v> <C-r>+
cnoremap <C-v> <C-r>+

set scrolloff=8         
set sidescrolloff=8     
set noswapfile       
set nobackup            
set undodir=~/.vim/undodir
set undofile            

