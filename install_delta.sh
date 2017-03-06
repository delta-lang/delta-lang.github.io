if [ ! -d delta ]; then
    git clone --depth=1 https://github.com/delta-lang/delta.git
fi

cd delta

if [ ! -d cmake-3.1.3-Linux-x86_64 ]; then
    curl -L https://cmake.org/files/v3.1/cmake-3.1.3-Linux-x86_64.tar.gz | tar xz
fi

if [ ! -d boost_1_63_0 ]; then
    curl -L https://downloads.sourceforge.net/project/boost/boost/1.63.0/boost_1_63_0.tar.gz?r=https%3A%2F%2Fsourceforge.net%2Fprojects%2Fboost%2Ffiles%2Fboost%2F1.63.0%2F&ts=1488836101&use_mirror=netcologne | tar xz
fi

if [ ! -d clang+llvm-3.9.0-x86_64-linux-gnu-ubuntu-14.04 ]; then
    curl -L http://releases.llvm.org/3.9.0/clang+llvm-3.9.0-x86_64-linux-gnu-ubuntu-14.04.tar.xz | tar xJ
fi

cmake-3.1.3-Linux-x86_64/bin/cmake -G 'Unix Makefiles' -DCMAKE_PREFIX_PATH='$PWD/clang+llvm-3.9.0-x86_64-linux-gnu-ubuntu-14.04;boost_1_63_0' .
make
