DELTA_VERSION=$(cat "$(dirname $0)/.delta-version")
LLVM_LONG_VERSION=4.0.0
LLVM_SHORT_VERSION=4.0

if [ ! -d delta ]; then
    git clone https://github.com/delta-lang/delta.git
fi

cd delta
git checkout $DELTA_VERSION

curl -L "https://cmake.org/files/v3.1/cmake-3.1.3-Linux-x86_64.tar.gz" | tar xz
curl -L "http://releases.llvm.org/$LLVM_LONG_VERSION/clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-14.04.tar.xz" | tar xJ

cmake-3.1.3-Linux-x86_64/bin/cmake -G 'Unix Makefiles' -DCMAKE_PREFIX_PATH=$PWD/clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-14.04 .
make

# Reduce size for Heroku slug compression.
rm -rf cmake-3.1.3-Linux-x86_64
mkdir -p ../bin ../lib/clang/$LLVM_LONG_VERSION
mv clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-14.04/bin/clang-$LLVM_SHORT_VERSION ../bin/clang
mv clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-14.04/lib/clang/$LLVM_LONG_VERSION/include ../lib/clang/$LLVM_LONG_VERSION
rm -rf clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-14.04
rm src/**/*.a
