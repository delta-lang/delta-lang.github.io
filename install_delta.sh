LLVM_LONG_VERSION=4.0.0
LLVM_SHORT_VERSION=4.0

if [ ! -d delta ]; then
    git clone --depth=1 https://github.com/delta-lang/delta.git
fi

cd delta

curl -L "https://cmake.org/files/v3.1/cmake-3.1.3-Linux-x86_64.tar.gz" | tar xz
curl -L "https://downloads.sourceforge.net/project/boost/boost/1.63.0/boost_1_63_0.tar.gz?r=https%3A%2F%2Fsourceforge.net%2Fprojects%2Fboost%2Ffiles%2Fboost%2F1.63.0%2F&ts=1488836101&use_mirror=netcologne" | tar xz
curl -L "http://releases.llvm.org/$LLVM_LONG_VERSION/clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-14.04.tar.xz" | tar xJ
sudo apt-get install libedit-dev

cmake-3.1.3-Linux-x86_64/bin/cmake -G 'Unix Makefiles' -DCMAKE_PREFIX_PATH=$PWD/clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-14.04 -DBOOST_ROOT=$PWD/boost_1_63_0 .
make

# Reduce size for Heroku slug compression.
rm -rf cmake-3.1.3-Linux-x86_64
rm -rf boost_1_63_0
mkdir -p ../bin ../lib/clang/$LLVM_LONG_VERSION
mv clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-14.04/bin/clang-$LLVM_SHORT_VERSION ../bin/clang
mv clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-14.04/lib/clang/$LLVM_LONG_VERSION/include ../lib/clang/$LLVM_LONG_VERSION
rm -rf clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-14.04
rm src/**/*.a
