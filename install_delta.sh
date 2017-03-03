if [ ! -d delta ]; then
    git clone --depth=1 https://github.com/delta-lang/delta.git
fi

cd delta

if [ ! -d clang+llvm-3.9.0-x86_64-linux-gnu-ubuntu-14.04 ]; then
    curl -L http://releases.llvm.org/3.9.0/clang+llvm-3.9.0-x86_64-linux-gnu-ubuntu-14.04.tar.xz | tar xJ
fi

cmake -G 'Unix Makefiles' -DCMAKE_PREFIX_PATH=$PWD/clang+llvm-3.9.0-x86_64-linux-gnu-ubuntu-14.04 .
make
